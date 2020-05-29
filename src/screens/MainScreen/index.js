import React from 'react';
import { View } from 'react-native';
import { RoundButton } from './buttons';
import { useStore } from '../../store/store';
import useScreen from '../screen_hooks';
import Layout from './layout';
import withInitState from '../../store/init_state';
import Notifications from './notifications';
import CurrentServer from './current_server';

const MainScreen = () => {
    const [{ provider_tokens, current_vpn_server, vpn_status }, { toggleVPN }] = useStore();
    const { SettingsScreenModel } = useScreen();

    if (provider_tokens.length === 0) {
        return (
            <Layout>
                <RoundButton label={'Get Started!'} onPress={SettingsScreenModel} />
            </Layout>
        );
    }

    let disabled = vpn_status === 'Connecting' || vpn_status === 'Disconnecting';

    let button_label = vpn_status;
    switch (vpn_status) {
        case 'Connected':
            button_label = 'Disconnect';
            break;
        case 'Disconnected':
            button_label = 'Connect';
            break;
    }

    const toggleVPNOrSettingsScreenModel = () => {
        if (current_vpn_server) {
            toggleVPN();
        } else {
            SettingsScreenModel();
        }
    };

    return (
        <Layout>
            <RoundButton label={button_label} onPress={toggleVPNOrSettingsScreenModel} disabled={disabled} />
            <View style={{ marginTop: 10, marginBottom: 10 }}>
                <CurrentServer />
            </View>
            <View style={{ marginTop: 10, marginBottom: 10 }}>
                <Notifications />
            </View>
        </Layout>
    );
};

export default withInitState(MainScreen);
