'use strict';

import { RSA } from 'react-native-rsa-native';
// @ts-ignore
import forge from 'node-forge';

export interface Keypair {
    authorizedKey: string;
    fingerprint: string;
    publicKey: string;
    privateKey: string;
}

class Keygen {
    static async generateKeyPair(): Promise<Keypair> {
        let keys = await RSA.generateKeys(4096);

        let privateKey = keys.private;
        let publicKey = keys.public;

        let forgePrivateKey = forge.pki.privateKeyFromPem(privateKey);
        let forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

        let authorizedKey = forge.ssh.publicKeyToOpenSSH(forgePublicKey);
        let fingerprint = forge.ssh.getPublicKeyFingerprint(forgePublicKey, { encoding: 'hex', delimiter: ':' });

        return {
            authorizedKey,
            fingerprint,
            publicKey,
            privateKey,
        };
    }
}

export default Keygen;
