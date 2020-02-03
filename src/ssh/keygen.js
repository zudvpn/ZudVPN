'use strict';

import { RSA } from 'react-native-rsa-native';
import forge from 'node-forge';

class Keygen {
    static async generateKeyPair() {
        let keys = await RSA.generateKeys(4096);
        console.log('generated ssh keys:', keys);
        this.privateKey = keys.private;
        this.publicKey = keys.public;

        this.forgePrivateKey = forge.pki.privateKeyFromPem(this.privateKey);
        this.forgePublicKey = forge.pki.setRsaPublicKey(this.forgePrivateKey.n, this.forgePrivateKey.e);

        console.log(this.publicKey, forge.pki.publicKeyToPem(this.forgePublicKey));

        this.authorizedKey = forge.ssh.publicKeyToOpenSSH(this.forgePublicKey);
        console.log('authorized key: ', this.authorizedKey);

        return {
            publicKey: this.publicKey,
            privateKey: this.privateKey,
            authorizedKey: this.authorizedKey,
        };
    }
}

export default Keygen;
