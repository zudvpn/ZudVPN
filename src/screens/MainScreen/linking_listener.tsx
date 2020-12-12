import { useEffect } from 'react';
import { parse_linking_url_token } from '../../helper';
import { Linking, Platform } from 'react-native';
// @ts-ignore
import RNNetworkExtension from 'react-native-network-extension';
import { useStore } from '../../store/store';
import StaticServer from '../../static_server';
import { Navigation } from 'react-native-navigation';
// @ts-ignore
import SafariView from 'react-native-safari-view';
import withClient from '../../providers/with_client';
import logger from '../../logger';

const LinkingListener = (props: any) => {
    const [, { addProviderToken, setVPNStatus, notify, resetNotification }] = useStore();

    useEffect(() => {
        const networkStatusCallback = (status: string) => {
            logger.debug('Network status: ' + status);
            setVPNStatus(status);
        };

        const networkFailCallback = (reason: string) => {
            logger.debug('Network failed, reason: ' + reason);
            setVPNStatus('Connect');
        };

        const handleCallback = async (url: string) => {
            // Reset/remove previous notifications from main screen.
            resetNotification();
            const providerToken = parse_linking_url_token(url);

            if (providerToken) {
                const client = props.client.createClient({
                    provider: providerToken.provider,
                    accessToken: providerToken.accessToken,
                });

                try {
                    providerToken.account = await client.getAccount();
                    addProviderToken(providerToken);
                } catch (e) {
                    notify('error', 'Cannot add provider token: ' + e.message);
                }
            } else {
                notify('error', 'Cannot add provider token: Missing access token.');
            }

            // We assume that after receiving callback url from Provider registration/login page
            // our static server, navigation modal and safari view are still open,
            // thus we programmatically return user to main screen.
            StaticServer.stop();
            Navigation.dismissAllModals();
            SafariView.dismiss();
        };

        const handleCallbackEvent = (event: any) => {
            handleCallback(event.url);
        };

        if (Platform.OS === 'android') {
            Linking.getInitialURL().then((url) => {
                handleCallback(url as string);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return props.children;
};

export default withClient(LinkingListener);
