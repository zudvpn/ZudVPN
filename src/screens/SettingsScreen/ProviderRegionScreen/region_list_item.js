import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { useStore } from '../../../store/store';
import withClient from '../../../providers/with_client';
import logger from '../../../logger';
import { BACKGROUND_SECONDARY, COLOR_SECONDARY } from '../../../theme';

const RegionListItem = ({ item, provider, client }) => {
    const [, { setCurrentVPNServer, setVPNStatus, notify }] = useStore();

    const addServer = (region) => {
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
                notify('error', `Failed to create VPN Server: ${e.message || JSON.stringify(e)}`);
            }
        }, 500);
    };

    const confirmAddServer = (region) => {
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
                containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }}
                onPress={() => confirmAddServer(item)}
                title={item.name}
                titleStyle={{ color: COLOR_SECONDARY }}
                subtitle={item.slug}
                subtitleStyle={{ opacity: 0.5, color: COLOR_SECONDARY }}
                bottomDivider
                chevron
            />
        );
    }

    return (
        <ListItem
            containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }}
            titleStyle={[styles.disabled, { color: COLOR_SECONDARY }]}
            title={item.name}
            subtitle={item.slug}
            subtitleStyle={{ opacity: 0.5, color: COLOR_SECONDARY }}
            rightTitle={'unavailable'}
            rightTitleStyle={{ opacity: 0.3, color: COLOR_SECONDARY }}
            bottomDivider
        />
    );
};

export default withClient(RegionListItem);

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.7,
    },
});
