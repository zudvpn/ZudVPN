import { createStore, createHook } from 'react-sweet-state';
import RNNetworkExtension from 'react-native-network-extension';
import AsyncStorage from '@react-native-community/async-storage';
import notification from '../notification_core';

export const INITIAL_STATE_KEY = 'INITIAL_STATE_KEY';

const initialState = {
    vpn_status: 'Disconnected',
    provider_tokens: [],
    current_vpn_server: null,
    logs: [],
};

const actions = {
    addProviderToken: token => ({ setState, getState, dispatch }) => {
        if (token) {
            setState({ provider_tokens: [...getState().provider_tokens, token] });

            dispatch(actions.persistState());
        } else {
            throw new Error('Token data cannot be empty');
        }
    },
    setCurrentVPNServer: server => ({ setState, dispatch }) => {
        setState({ current_vpn_server: server });

        dispatch(actions.persistState());
    },
    setVPNStatus: status => ({ setState, getState }) => {
        setState({ vpn_status: status });
    },
    triggerVPN: () => async ({ setState, getState, dispatch }) => {
        if (getState().vpn_status === 'Connected') {
            console.log('stopping vpn');
            RNNetworkExtension.disconnect();
        } else {
            console.log('triggered vpn');
            setState({ vpn_status: 'Connecting' });

            try {
                await RNNetworkExtension.connect();
            } catch (e) {
                console.log('VPN connect error', e);
                dispatch(actions.setLog('VPN connect error', e));
            }
        }
    },
    triggerSignOut: provider => ({ setState, getState, dispatch }) => {
        setState({ provider_tokens: getState().provider_tokens.filter(token => token.provider !== provider.id) });
        dispatch(actions.persistState());
    },
    setLog: (...message) => ({ setState, getState }) => {
        notification.log(message);
        const logs = [...notification.logs()];
        setState({ logs: logs.reverse() });
    },
    initState: state => ({ setState }) => setState(state),
    persistState: () => ({ setState, getState }) => {
        const state = {
            provider_tokens: getState().provider_tokens,
            current_vpn_server: getState().current_vpn_server,
        };

        AsyncStorage.setItem(INITIAL_STATE_KEY, JSON.stringify(state));
    },
};

const Store = createStore({
    name: 'main_store',
    initialState,
    actions,
});

export const useStore = createHook(Store);
