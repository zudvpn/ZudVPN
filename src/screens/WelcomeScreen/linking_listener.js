import React, { useEffect } from 'react';
import { parse_linking_url_params } from '../../helper';
import { Linking, Platform } from 'react-native';
import RNNetworkExtension from 'react-native-network-extension';
import { useStore } from '../../store/store';
import StaticServer from '../../static_server';
import { Navigation } from 'react-native-navigation';
import SafariView from 'react-native-safari-view';

const LinkingListener = props => {
    const [, actions] = useStore();

    useEffect(() => {
        console.log('linking listener use effect 1');
        const networkStatusCallback = status => {
            console.log('newtork status: ', status);
            actions.setVPNStatus(status);
        };

        const networkFailCallback = reason => {
            console.log('network fail reason: ', reason);
            actions.setVPNStatus('Connect');
        };

        const handleCallback = url => {
            try {
                const provider_token = parse_linking_url_params(url);
                actions.addProviderToken(provider_token);
            } catch (e) {
                actions.setLog('Cannot add provider token.');
            }

            // We assume that after receiving callback url from Provider registration/login page
            // our static server, navigation modal and safari view are still open,
            // thus we programmatically return user to main screen.
            StaticServer.stop();
            Navigation.dismissAllModals();
            SafariView.dismiss();
        };

        const handleCallbackEvent = event => {
            handleCallback(event.url);
        };

        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                handleCallback(url);
            });
        } else {
            Linking.addEventListener('url', handleCallbackEvent);
        }

        const vpnStatusListener = RNNetworkExtension.addEventListener('status', networkStatusCallback);

        const vpnFailListener = RNNetworkExtension.addEventListener('fail', networkFailCallback);

        // remove listeners on component unmount
        return () => {
            Linking.removeEventListener('url', handleCallbackEvent);

            vpnStatusListener.remove();
            RNNetworkExtension.removeEventListener('status', networkStatusCallback);

            vpnFailListener.remove();
            RNNetworkExtension.removeEventListener('fail', networkFailCallback);
        };
    }, []);

    return props.children;
};

export default LinkingListener;
