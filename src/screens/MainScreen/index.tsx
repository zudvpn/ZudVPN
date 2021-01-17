import React from 'react';
import { View } from 'react-native';
import { RoundButton } from './buttons';
import { useStore } from '../../store/store';
import useScreen from '../useScreen';
import AcceptPrivacy from './AcceptPrivacy';
import Layout from './layout';
import withInitState from '../../store/withInitState';
import Notifications from './notifications';
import CurrentServer from './current_server';

const MainScreen = () => {
    const [{ privacyAccepted, providerTokens, currentServer, vpnStatus }, { toggleVPN }] = useStore();
    const { SettingsScreenModal } = useScreen();

    if (!privacyAccepted) {
        return <AcceptPrivacy />;
    }

    if (providerTokens.length === 0) {
        return (
            <Layout>
                <RoundButton label={'Get Started!'} onPress={SettingsScreenModal} />
                <View style={{ marginVertical: 10 }}>
                    <Notifications />
                </View>
            </Layout>
        );
    }

    let disabled = vpnStatus === 'Connecting' || vpnStatus === 'Disconnecting';

    let buttonLabel = vpnStatus;
    switch (vpnStatus) {
        case 'Connected':
            buttonLabel = 'Disconnect';
            break;
        case 'Disconnected':
            buttonLabel = 'Connect';
            break;
    }

    const toggleVPNOrSettingsScreenModal = () => {
        if (currentServer) {
            toggleVPN();
        } else {
            SettingsScreenModal();
        }
    };

    return (
        <Layout>
            <RoundButton label={buttonLabel} onPress={toggleVPNOrSettingsScreenModal} disabled={disabled} />
            <View style={{ marginVertical: 10 }}>
                <CurrentServer />
            </View>
            <View style={{ marginVertical: 10 }}>
                <Notifications />
            </View>
        </Layout>
    );
};

export default withInitState(MainScreen);
