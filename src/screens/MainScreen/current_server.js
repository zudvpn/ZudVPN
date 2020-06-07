import React from 'react';
import { IconButton } from './buttons';
import { useStore } from '../../store/store';
import useScreen from '../screen_hooks';

const CurrentServer = () => {
    const [{ current_vpn_server }] = useStore();
    const { SettingsScreenModel } = useScreen();

    if (current_vpn_server) {
        const label = `Provider: ${current_vpn_server.provider.name}\nRegion: ${current_vpn_server.region.name}\nIP Address: ${current_vpn_server.ipv4_address}`;
        return <IconButton label={label} onPress={SettingsScreenModel} />;
    }

    return null;
};

export default CurrentServer;
