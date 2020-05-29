import React, { useEffect } from 'react';
import { parse_linking_url_params } from '../../helper';
import { Linking, Platform } from 'react-native';
import RNNetworkExtension from 'react-native-network-extension';
import { useStore } from '../../store/store';
import StaticServer from '../../static_server';
import { Navigation } from 'react-native-navigation';
import SafariView from 'react-native-safari-view';
import withClient from '../../providers/with_client';
import logger from '../../logger';

const LinkingListener = props => {
    const [, actions] = useStore();

    useEffect(() => {
        const networkStatusCallback = status => {
            logger.debug('Network status: ' + status);
            actions.setVPNStatus(status);
        };

        const networkFailCallback = reason => {
            logger.debug('Network failed, reason: ' + reason);
            actions.setVPNStatus('Connect');
        };

        const handleCallback = async url => {
            const provider_token = parse_linking_url_params(url);

            if (provider_token.hasOwnProperty('provider') && provider_token.hasOwnProperty('access_token')) {
                const client = props.client.createClient(provider_token.provider, provider_token.access_token);

                try {
                    provider_token.account = await client.getAccount();
                    actions.addProviderToken(provider_token);
                } catch (e) {
                    logger.error('Cannot add provider token: ' + e.message);
                }
            } else {
                logger.error('Cannot add provider token: Missing access token.');
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

export default withClient(LinkingListener);
