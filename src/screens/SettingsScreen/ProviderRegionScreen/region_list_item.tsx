import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { useStore } from '../../../store/store';
import withClient from '../../../providers/with_client';
import logger from '../../../logger';
import { BACKGROUND_SECONDARY, COLOR_SECONDARY } from '../../../theme';
import { Region } from 'providers/types/Region';
import { Provider } from 'providers/types/Provider';
import Client from 'providers/client';

interface Props {
    item: Region;
    provider: Provider;
    client: Client;
}

const RegionListItem = ({ item, provider, client }: Props) => {
    const [, { setCurrentVPNServer, setVPNStatus, notify }] = useStore();

    const addServer = (region: Region) => {
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

    const confirmAddServer = (region: Region) => {
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
                bottomDivider
                onPress={() => confirmAddServer(item)}>
                <ListItem.Content>
                    <ListItem.Title style={{ color: COLOR_SECONDARY }}>{item.name}</ListItem.Title>
                    <ListItem.Subtitle style={{ opacity: 0.5, color: COLOR_SECONDARY }}>{item.slug}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        );
    }

    return (
        <ListItem containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }} bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={[styles.disabled, { color: COLOR_SECONDARY }]}>{item.name}</ListItem.Title>
                <ListItem.Subtitle style={{ opacity: 0.5, color: COLOR_SECONDARY }}>{item.slug}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content right>
                <ListItem.Title right style={{ opacity: 0.3, color: COLOR_SECONDARY }}>
                    {'unavailable'}
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );
};

export default withClient(RegionListItem);

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.7,
    },
});
