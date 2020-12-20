import React, { Component } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
// @ts-ignore
import SSHClient from 'react-native-ssh-sftp';
import Keychain from '../../keychain';
import WebView from 'react-native-webview';
import TerminalServer from './terminal_server';
import logger from '../../logger';
import { BACKGROUND_PRIMARY } from '../../theme';

interface Props {
    componentId: string;
    name: string;
    ipv4Address: string;
}

interface State {
    sshClient: SSHClient | null;
    terminalUrl: string | null;
}

class SSHTerminalScreen extends Component<Props, State> {
    webref: any;

    constructor(props: any) {
        super(props);
        Navigation.events().bindComponent(this);

        this.state = {
            sshClient: null,
            terminalUrl: null,
        };
    }

    navigationButtonPressed({ buttonId }: { buttonId: string }) {
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
                this.props.ipv4Address,
                22,
                'rancher',
                {
                    privateKey: sshKeyPair.privateKey,
                    publicKey: sshKeyPair.authorizedKey,
                },
                (error: any) => {
                    if (error) {
                        this.sendMessage(error);
                    } else {
                        this.setState({ sshClient });

                        sshClient.startShell('xterm', (shellError: any) => {
                            if (shellError) {
                                this.sendMessage(shellError);
                            }
                        });

                        sshClient.on('Shell', (event: any) => {
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

    onMessage = (event: any) => {
        let { sshClient } = this.state;

        let command = JSON.parse(event.nativeEvent.data);
        if (sshClient) {
            sshClient.writeToShell(command, (error: any) => {
                if (error) {
                    this.sendMessage(error);
                }
            });
        }
    };

    sendMessage = (message: string) => {
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
