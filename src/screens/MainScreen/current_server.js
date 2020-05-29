import React from 'react';
import { IconButton } from './buttons';
import { useStore } from '../../store/store';
import useScreen from '../screen_hooks';

const CurrentServer = () => {
    const [{ current_vpn_server }] = useStore();
    const { SettingsScreenModel } = useScreen();

    if (current_vpn_server) {
        const label = `${current_vpn_server.region.name} (${current_vpn_server.name})`;
        return <IconButton label={label} onPress={SettingsScreenModel} />;
    }

    return null;
};

export default CurrentServer;
