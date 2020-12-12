import { createStore, createHook, SetState, GetState } from 'react-sweet-state';
// @ts-ignore
import RNNetworkExtension from 'react-native-network-extension';
import logger from '../logger';
import Keychain from '../keychain';
import { Token } from 'providers/types/Token';
import { Server } from 'providers/types/Server';
import { Provider } from 'providers/types/Provider';

interface State {
    providerTokens: Token[];
    currentServer: Server | null;
    vpnStatus: string;
    notifications: { type: string; notification: string }[];
}

const initialState: State = {
    providerTokens: [],
    currentServer: null,
    vpnStatus: 'Disconnected',
    notifications: [],
};

interface StoreActions {
    setState: SetState<State>;
    getState: GetState<State>;
    dispatch: any;
}

const actions = {
    addProviderToken: (token: Token) => ({ setState, getState, dispatch }: StoreActions) => {
        setState({ providerTokens: [...getState().providerTokens, token] });

        dispatch(actions.persistState());
    },
    setCurrentVPNServer: (server: Server | null) => ({ setState, dispatch }: StoreActions) => {
        setState({ currentServer: server });

        dispatch(actions.persistState());
    },
    setVPNStatus: (status: string) => ({ setState }: StoreActions) => {
        setState({ vpnStatus: status });
    },
    toggleVPN: () => async ({ setState, getState, dispatch }: StoreActions) => {
        if (getState().vpnStatus === 'Connected') {
            RNNetworkExtension.disconnect();
        } else {
            setState({ vpnStatus: 'Connecting' });

            try {
                await RNNetworkExtension.connect();
            } catch (e) {
                dispatch(actions.notify('error', `Failed to start VPN connection: ${e.message || JSON.stringify(e)}`));
            }
        }
    },
    triggerSignOut: (provider: Provider) => ({ setState, getState, dispatch }: StoreActions) => {
        setState({
            providerTokens: getState().providerTokens.filter((token: Token) => token.provider !== provider.id),
        });

        dispatch(actions.persistState());
    },
    resetNotification: () => ({ setState }: StoreActions) => {
        setState({ notifications: [] });
    },
    notify: (type: string, notification: string) => ({ setState, getState }: StoreActions) => {
        setState({ notifications: [{ type, notification }, ...getState().notifications] });

        logger.log(type, notification);
    },
    initState: (state: State) => ({ setState }: StoreActions) => setState(state),
    persistState: () => ({ getState }: StoreActions) => {
        const state = {
            provider_tokens: getState().providerTokens,
            current_vpn_server: getState().currentServer,
        };

        Keychain.setInitialState(state);
    },
};

const Store = createStore({
    name: 'main_store',
    initialState,
    actions,
});

export const useStore = createHook(Store);
