import React, { useState, useCallback } from 'react';
import { Alert, Text, SafeAreaView, ScrollView, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
// @ts-ignore
import RNNetworkExtension from 'react-native-network-extension';
import { useStore } from '../../store/store';
import ServerItem from './server_item';
import useScreen from '../useScreen';
import withClient from '../../providers/with_client';
import { ProviderListItem } from './provider_list_item';
import { AVAILABLE_PROVIDERS } from '../../providers';
import { Divider, ListItem } from 'react-native-elements';
import { BACKGROUND_PRIMARY, BACKGROUND_SECONDARY, COLOR_SECONDARY } from '../../theme';
import style from './styles';
// @ts-ignore
import SafariView from 'react-native-safari-view';
import { Server } from 'providers/types/Server';

const SettingsScreen = (props: any) => {
    const [servers, setServers] = useState<Server[] | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [{ currentServer, vpnStatus }, { setCurrentVPNServer, setVPNStatus, notify }] = useStore();
    const { LogFileViewerScreenPush } = useScreen();

    Navigation.events().registerNavigationButtonPressedListener(({ buttonId, componentId }) => {
        if (componentId === props.componentId && buttonId === 'done_button') {
            Navigation.dismissModal(props.componentId);
        }
    });

    const select = (server: Server) => () => {
        setVPNStatus('Connecting');

        props.client
            .configureServer(server.provider.id, server, notify)
            .then(() => {
                setCurrentVPNServer(server);
                notify('success', 'VPN server is ready for connection');
            })
            .catch((e: Error) => {
                setVPNStatus('Connect');
                notify('error', `Failed to connect to VPN server: ${e.message || JSON.stringify(e)}`);
            });

        Navigation.dismissModal(props.componentId);
    };

    const destroyConfirmed = (uid: string) => {
        if (!servers) {
            return;
        }

        const server = servers.filter((_server) => _server.uid === uid);

        if (!server) {
            return;
        }

        Promise.all([
            props.client.deleteServer(server[0]).catch((e: Error) => e),
            RNNetworkExtension.remove().catch((e: Error) => e),
        ]);

        if (currentServer !== null && currentServer.uid === uid) {
            setCurrentVPNServer(null);
            setVPNStatus('Connect');
        }

        // remove deleted server from servers list
        setServers(servers.filter((_server) => _server.uid !== uid));
    };

    const destroy = (uid: string) => () => {
        Alert.alert('Warning!', 'Are you sure you want to destroy this server? This action cannot be undone.', [
            {
                text: 'Destroy',
                onPress: () => destroyConfirmed(uid),
                style: 'destructive',
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
    };

    const retrieveServers = async () => {
        const _servers = await props.client.getServers();

        setServers(_servers);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);

        retrieveServers().then(() => setRefreshing(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshing]);

    if (servers === null) {
        setTimeout(() => {
            retrieveServers();
        }, 0);
    }

    const togglePiHoleWebPage = () => {
        SafariView.show({
            url: 'http://pi.hole:81/',
            fromBottom: true,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_PRIMARY }}>
            <ScrollView
                style={{ flex: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {servers === null && <ActivityIndicator style={{ padding: 10 }} />}
                {servers !== null &&
                    servers.length > 0 &&
                    servers.map((server) => (
                        <ServerItem key={server.uid} server={server} select={select} destroy={destroy} />
                    ))}
                <Text style={style.section_title}>CLOUD PROVIDERS</Text>
                <Divider />
                <FlatList
                    data={AVAILABLE_PROVIDERS}
                    renderItem={({ item }) => <ProviderListItem item={item} componentId={props.componentId} />}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Divider />
                <Text style={style.section_title}>ADVANCED</Text>
                <Divider />
                <ListItem
                    containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }}
                    onPress={() => LogFileViewerScreenPush(props.componentId)}
                    title={'Application logs'}
                    titleStyle={{ color: COLOR_SECONDARY }}
                    bottomDivider
                    chevron
                />
                {vpnStatus === 'Connected' && (
                    <ListItem
                        containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }}
                        onPress={() => togglePiHoleWebPage()}
                        title={'PiHole Ad-blocker'}
                        titleStyle={{ color: COLOR_SECONDARY }}
                        bottomDivider
                        chevron
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default withClient(SettingsScreen);
