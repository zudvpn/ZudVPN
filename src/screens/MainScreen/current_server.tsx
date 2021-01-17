import React from 'react';
import { IconButton } from './buttons';
import { useStore } from '../../store/store';
import useScreen from '../useScreen';

const CurrentServer = () => {
    const [{ currentServer }] = useStore();
    const { SettingsScreenModal } = useScreen();

    if (currentServer) {
        const label = `Provider: ${currentServer.provider.name}\nRegion: ${currentServer.region.name}\nIP Address: ${currentServer.ipv4Address}`;
        return <IconButton label={label} onPress={SettingsScreenModal} />;
    }

    return null;
};

export default CurrentServer;
