import React, { Component } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import SSHClient from 'react-native-ssh-sftp';
import Keychain from '../../keychain';
import WebView from 'react-native-webview';
import TerminalServer from './terminal_server';
import logger from '../../logger';
import { BACKGROUND_PRIMARY } from '../../theme';

class SSHTerminalScreen extends Component {
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
                (error) => {
                    if (error) {
                        this.sendMessage(error);
                    } else {
                        this.setState({ sshClient });

                        sshClient.startShell('xterm', (shell_error) => {
                            if (shell_error) {
                                this.sendMessage(shell_error);
                            }
                        });

                        sshClient.on('Shell', (event) => {
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

    onMessage = (event) => {
        let { sshClient } = this.state;

        this.command = JSON.parse(event.nativeEvent.data);
        if (sshClient) {
            sshClient.writeToShell(this.command, (error) => {
                if (error) {
                    this.sendMessage(error);
                }
            });
        }
    };

    sendMessage = (message) => {
        if (this.webref) {
            message = message.replace(/\n/gi, '\\r');
            this.webref.injectJavaScript(`window.terminal.write(\`${message}\`);true;`);
        }
    };

    render() {
        let { terminalUrl } = this.state;

        if (terminalUrl === null) {
            this.startTerminalServer();

            return (
                <SafeAreaView
                    style={{
                        backgroundColor: BACKGROUND_PRIMARY,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator size={'large'} />
                </SafeAreaView>
            );
        }

        return (
            <WebView
                style={{ backgroundColor: BACKGROUND_PRIMARY }}
                ref={(ref) => (this.webref = ref)}
                originWhitelist={['*']}
                source={{ uri: terminalUrl }}
                onMessage={this.onMessage}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    logger.warn('Terminal WebView error:', nativeEvent);
                }}
            />
        );
    }
}

export default SSHTerminalScreen;
