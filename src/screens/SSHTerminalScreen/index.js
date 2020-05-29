import React, { Component } from 'react';
import { Text, TextInput, SafeAreaView, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import SSHClient from 'react-native-ssh-sftp';
import Keychain from '../../keychain';

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
            output: null,
        };
    }

    navigationButtonPressed({ buttonId }) {
        if (buttonId === 'cancel') {
            Navigation.dismissModal(this.props.componentId);
        }
    }

    async componentDidMount() {
        let sshKeyPair = await Keychain.getSSHKeyPair(this.props.name);

        if (!sshKeyPair) {
            this.setState({ output: 'SSH Keypair is not available.' });
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
                        this.setState({ output: error });
                    } else {
                        this.setState({ sshClient });

                        sshClient.startShell('vanilla', error => {
                            if (error) {
                                this.setState({ output: error });
                            }
                        });

                        sshClient.on('Shell', event => {
                            let { output } = this.state;
                            if (output === null) {
                                output = '';
                            }

                            this.setState({ output: output + event });
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
            sshClient.disconnect();
        }
    }

    write = event => {
        let { sshClient, output } = this.state;

        sshClient.writeToShell(event.nativeEvent.text + '\n', error => {
            if (error) {
                this.setState({ output: output + error });
            }
        });

        this.input.clear();
        this.input.focus();
    };

    render() {
        let { output } = this.state;

        if (output === null) {
            return (
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} />
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={'height'} keyboardVerticalOffset={90}>
                    <ScrollView style={{ flex: 1 }}>
                        <Text>{output}</Text>
                        <TextInput
                            style={{ borderWidth: 1, lineHeight: 22, fontSize: 18 }}
                            ref={ref => {
                                this.input = ref;
                            }}
                            autoFocus={true}
                            autoCapitalize="none"
                            autoCorrect="none"
                            onSubmitEditing={this.write}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

export default SSHTerminalScreen;
