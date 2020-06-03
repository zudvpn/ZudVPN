import React, { Component } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import SSHClient from 'react-native-ssh-sftp';
import Keychain from '../../keychain';
import WebView from 'react-native-webview';
import TerminalServer from './terminal_server';
import logger from '../../logger';

class SSHTerminalScreen extends Component {
    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Terminal',
                },
                leftButtons: [],
                rightButtons: [
                    {
                        id: 'cancel',
                        text: 'Cancel',
                    },
                ],
            },
        };
    }

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            sshClient: null,
            terminalUrl: null,
        };
    }

    navigationButtonPressed({ buttonId }) {
        if (buttonId === 'cancel') {
            Navigation.dismissModal(this.props.componentId);
        }
    }

    componentDidMount() {
        this.startSSHClient();
    }

    async startSSHClient() {
        logger.debug('Starting SSH Client');
        let sshKeyPair = await Keychain.getSSHKeyPair(this.props.name);

        if (!sshKeyPair) {
            this.sendMessage('SSH Keypair is not available. Cannot cannot to server terminal.');
        } else {
            let sshClient = new SSHClient(
                this.props.ipv4_address,
                2222,
                'core',
                {
                    privateKey: sshKeyPair.privateKey,
                    publicKey: sshKeyPair.authorizedKey,
                },
                error => {
                    if (error) {
                        this.sendMessage(error);
                    } else {
                        this.setState({ sshClient });

                        sshClient.startShell('xterm', error => {
                            if (error) {
                                this.sendMessage(error);
                            }
                        });

                        sshClient.on('Shell', event => {
                            this.sendMessage(event);
                        });
                    }
                },
            );
        }
    }

    componentWillUnmount() {
        let { sshClient } = this.state;

        if (sshClient) {
            console.log('SSH client is disconnectiong.');
            sshClient.closeShell();
            sshClient.disconnect();
        }
    }

    startTerminalServer = async () => {
        const url = await TerminalServer.serveTerminal();
        this.setState({ terminalUrl: url });
    };

    onMessage = event => {
        let { sshClient } = this.state;

        this.command = JSON.parse(event.nativeEvent.data);
        if (sshClient) {
            sshClient.writeToShell(this.command + '\n', error => {
                if (error) {
                    this.sendMessage(error);
                }
            });
        }
    };

    sendMessage = message => {
        if (this.webref) {
            this.webref.injectJavaScript(`
            window.localEcho.print(\`${message}\`)
            window.localEcho.read("")
                .then(input => window.ReactNativeWebView.postMessage(JSON.stringify(input)));
            true;`);
        }
    };

    render() {
        let { terminalUrl } = this.state;

        if (terminalUrl === null) {
            this.startTerminalServer();

            return (
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} />
                </SafeAreaView>
            );
        }

        return (
            <WebView
                ref={ref => (this.webref = ref)}
                originWhitelist={['*']}
                source={{ uri: terminalUrl }}
                onMessage={this.onMessage}
                onError={syntheticEvent => {
                    const { nativeEvent } = syntheticEvent;
                    logger.warn('Terminal WebView error:', nativeEvent);
                }}
            />
        );
    }
}

export default SSHTerminalScreen;
