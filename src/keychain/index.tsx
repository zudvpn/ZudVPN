import * as RNKeychain from 'react-native-keychain';
import { Keypair } from 'ssh/keygen';
import { Token } from 'providers/types/Token';
import { Server } from 'providers/types/Server';

export const INITIAL_STATE_KEY = 'INITIAL_STATE_KEY';

interface State {
    privacyAccepted: boolean;
    providerTokens: Token[];
    currentServer: Server | null;
}

const Keychain = {
    setInitialState: (state: State) => {
        Keychain.set(INITIAL_STATE_KEY, state);
    },

    getInitialState: async () => {
        return await Keychain.get(INITIAL_STATE_KEY);
    },

    setSSHKeyPair: (name: string, keypair: Keypair) => {
        Keychain.set(name, keypair);
    },

    getSSHKeyPair: async (name: string) => {
        return await Keychain.get(name);
    },

    set: (key: string, value: any) => {
        RNKeychain.setInternetCredentials(key, '', JSON.stringify(value));
    },

    get: async (key: string) => {
        const credentials = await RNKeychain.getInternetCredentials(key);

        if (credentials) {
            return JSON.parse(credentials.password);
        }

        return false;
    },
};

export default Keychain;
