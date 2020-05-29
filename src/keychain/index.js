import * as RNKeychain from 'react-native-keychain';

export const INITIAL_STATE_KEY = 'INITIAL_STATE_KEY';

const Keychain = {
    setInitialState: state => {
        Keychain.set(INITIAL_STATE_KEY, state);
    },

    getInitialState: async () => {
        return await Keychain.get(INITIAL_STATE_KEY);
    },

    setSSHKeyPair: (name, keypair) => {
        Keychain.set(name, keypair);
    },

    getSSHKeyPair: async name => {
        return await Keychain.get(name);
    },

    set: (key, value) => {
        RNKeychain.setInternetCredentials(key, '', JSON.stringify(value));
    },

    get: async key => {
        const available = await RNKeychain.hasInternetCredentials(key);

        if (available) {
            const creds = await RNKeychain.getInternetCredentials(key);

            return JSON.parse(creds.password);
        }

        return false;
    },
};

export default Keychain;
