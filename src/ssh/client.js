'use strict';

import NativeSSHClient from 'react-native-ssh-sftp';

class Client {
    constructor(keypair, user, host, port) {
        this.keypair = keypair;
        this.user = user;
        this.host = host;
        this.port = port;
    }

    async openSession() {
        if (!this.nativeSshClient) {
            return new Promise((resolve, reject) => {
                this.nativeSshClient = new NativeSSHClient(
                    this.host,
                    this.port,
                    this.user,
                    {
                        privateKey: this.keypair.privateKey,
                        publicKey: this.keypair.authorizedKey,
                    },
                    (error) => {
                        if (error) {
                            console.log('An error occurred while establishing SSH connection:', error);
                            this.nativeSshClient = null;
                            reject(error);
                        } else {
                            resolve(true);
                        }
                    },
                );
            });
        } else {
            console.log('SSH is open, reusing.');
        }
    }

    async run(command) {
        await this.openSession();

        return new Promise((resolve, reject) => {
            this.nativeSshClient.execute(command, (error, output) => {
                if (error) {
                    console.log('An error occured while executing command: ', command, error);
                    reject(error);
                } else {
                    resolve(output);
                }
            });
        });
    }

    closeSession() {
        if (this.nativeSshClient) {
            this.nativeSshClient.disconnect();
        }
    }
}

export default Client;
