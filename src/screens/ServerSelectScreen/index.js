import React, { useEffect, useState } from 'react';
import { Alert, Text, SafeAreaView, ScrollView, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { AddButton } from './buttons';
import RNNetworkExtension from 'react-native-network-extension';
import { useStore } from '../../store/store';
import RenderServer from './render_server';
import useScreen from '../screen_hooks';
import withClient from '../../providers/with_client';

const ServerSelectScreen = props => {
    const [servers, setServers] = useState(null);
    const [{ current_vpn_server }, { setCurrentVPNServer, setVPNStatus, setLog }] = useStore();
    const { SSHTerminalScreenModal, AddServerOverlayOverlay } = useScreen();

    Navigation.events().registerNavigationButtonPressedListener(({ buttonId, componentId }) => {
        if (componentId === props.componentId && buttonId === 'cancel') {
            Navigation.dismissModal(props.componentId);
        }
    });

    useEffect(() => {
        console.log('server select use effect 1');
        const retrieveServers = async () => {
            try {
                const _servers = await props.client.getServers();

                setServers(_servers);
            } catch (e) {
                setLog('Cannot retrieve server list from provider ', e);
            }
        };

        retrieveServers();
    }, []);

    const select = server => () => {
        console.log('selecting server ', server);
        setLog('Configuring VPN');
        setVPNStatus('Connecting');

        try {
            props.client.createServer(server.provider, server.region);
            setCurrentVPNServer(server);
        } catch (e) {
            setVPNStatus('Connect');
            setLog('Cannot create VPN server ', e);
        }

        Navigation.dismissModal(props.componentId);
    };

    const sshTerminal = (uid, ipv4_address) => () => {
        console.log('SSH connecting ', uid);
        SSHTerminalScreenModal(uid, ipv4_address);
    };

    const destroyConfirmed = uid => {
        const server = servers.filter(_server => _server.uid === uid);

        Promise.all([props.client.deleteServer(server[0]), RNNetworkExtension.remove()]);

        if (current_vpn_server !== null && current_vpn_server.uid === uid) {
            setCurrentVPNServer(null);
        }

        // remove deleted from servers
        setServers(servers.filter(_server => _server.uid !== uid));
    };

    const destroy = uid => () => {
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

    if (servers === null) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (servers.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 10 }}>
                    <Text>No servers available.</Text>
                    <AddButton onPress={() => AddServerOverlayOverlay()} />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                {servers.map(server => (
                    <RenderServer
                        key={server.uid}
                        server={server}
                        select={select}
                        destroy={destroy}
                        sshTerminal={sshTerminal}
                    />
                ))}
                <AddButton onPress={() => AddServerOverlayOverlay()} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default withClient(ServerSelectScreen);
