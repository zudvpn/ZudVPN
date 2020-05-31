import { Text, View } from 'react-native';
import styles from './styles';
import { SegmentButton } from './buttons';
import React from 'react';
import logger from '../../logger';
import useScreen from '../screen_hooks';

const RenderServer = ({ server, select, destroy }) => {
    const { SSHTerminalScreenModal } = useScreen();

    const sshTerminal = (name, ipv4_address) => () => {
        logger.debug(['SSH Terminal connection to: ', name]);
        SSHTerminalScreenModal(name, ipv4_address);
    };

    return (
        <View style={styles.server_container}>
            <View style={{ padding: 15 }}>
                <Text>Provider: {server.provider.name}</Text>
                <Text>Region: {server.region.name}</Text>
                <Text>IP Address: {server.ipv4_address}</Text>
            </View>
            <View style={styles.button_container}>
                <SegmentButton label={'Destroy'} labelStyle={{ color: 'red' }} onPress={destroy(server.uid)} />
                <View style={styles.button_separator} />
                <SegmentButton label={'Terminal'} onPress={sshTerminal(server.name, server.ipv4_address)} />
                <View style={styles.button_separator} />
                <SegmentButton label={'Select'} onPress={select(server)} />
            </View>
        </View>
    );
};

export default RenderServer;
