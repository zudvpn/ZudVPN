'use strict';

// @ts-ignore
import NativeSSHClient from 'react-native-ssh-sftp';
import { Keypair } from 'ssh/keygen';

class Client {
    keypair: Keypair;
    user: string;
    host: string;
    port: number;
    nativeSshClient: NativeSSHClient;

    constructor(keypair: Keypair, user: string, host: string, port: number) {
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
                    (error: any) => {
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

    async run(command: string): Promise<string> {
        await this.openSession();

        return new Promise((resolve, reject) => {
            this.nativeSshClient.execute(command, (error: any, output: any) => {
                if (error) {
                    console.log('An error occured while executing command: ', command, error);
                    reject(error);
                } else {
                    resolve(output);
                }
            });
        });
    }

    closeSession(): void {
        if (this.nativeSshClient) {
            this.nativeSshClient.disconnect();
        }
    }
}

export default Client;
