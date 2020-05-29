import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { useStore } from '../../store/store';
import withClient from '../../providers/with_client';
import logger from '../../logger';

const RenderProviderRegion = ({ item, provider, client }) => {
    const [, { setCurrentVPNServer, setVPNStatus, notify }] = useStore();

    const addServer = region => {
        Navigation.dismissAllModals();

        setTimeout(async () => {
            try {
                logger.info('VPN is not configured. Creating a new VPN server.');
                setVPNStatus('Connecting');

                const server = await client.createServer(provider.id, region, notify);
                setCurrentVPNServer(server);

                notify('success', 'Voila! VPN server is ready for connection.');
            } catch (e) {
                setVPNStatus('Connect');
                notify('error', `Failed to create VPN Server: ${e.message || e}`);
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

    if (item.available) {
        return (
            <ListItem
                onPress={() => confirmAddServer(item)}
                title={item.name}
                subtitle={item.slug}
                subtitleStyle={{ opacity: 0.5 }}
                bottomDivider
                chevron
            />
        );
    }

    return (
        <ListItem
            titleStyle={styles.disabled}
            title={item.name}
            subtitle={item.slug}
            subtitleStyle={{ opacity: 0.5 }}
            rightTitle={'unavailable'}
            rightTitleStyle={{ opacity: 0.3 }}
            bottomDivider
        />
    );
};

export default withClient(RenderProviderRegion);

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.7,
    },
});
