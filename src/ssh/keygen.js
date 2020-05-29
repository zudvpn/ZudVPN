'use strict';

import { RSA } from 'react-native-rsa-native';
import forge from 'node-forge';

class Keygen {
    static async generateKeyPair() {
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
