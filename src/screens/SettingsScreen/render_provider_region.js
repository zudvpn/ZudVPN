import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { useStore } from '../../store/store';
import withClient from '../../providers/with_client';

const RenderProviderRegion = ({ item, provider, client }) => {
    const [, { setCurrentVPNServer, setVPNStatus, setLog }] = useStore();

    const addServer = region => {
        Navigation.dismissAllModals();

        setTimeout(async () => {
            try {
                console.log('add vpn server triggered.');
                setLog('VPN is not configured. Creating new VPN server.');
                setVPNStatus('Connecting');
                const server = await client.createServer(provider.id, region);
                setCurrentVPNServer(server);
            } catch (e) {
                setVPNStatus('Connect');
                setLog('Cannot create VPN server ', e);
            }
        }, 500);
    };

    const confirmAddServer = region => {
        Alert.alert('Confirm', `This will create a VPN server on "${region.name}" region on ${provider.name}`, [
            {
                text: 'Proceed',
                onPress: () => addServer(region),
            },
            {
                text: 'Cancel',
                style: 'cancel',
            },
        ]);
    };

    return (
        <ListItem
            onPress={() => confirmAddServer(item)}
            titleStyle={[!item.available && styles.disabled]}
            title={item.name}
            subtitle={item.slug}
            subtitleStyle={{ opacity: 0.5 }}
            rightTitle={!item.available && 'unavailable'}
            rightTitleStyle={!item.available && { opacity: 0.3 }}
            bottomDivider
            chevron={item.available}
        />
    );
};

export default withClient(RenderProviderRegion);

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.7,
    },
});
