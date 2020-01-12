import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, ScrollView, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ProviderButton } from '../ProviderRegisterScreen/buttons';
import { useStore } from '../../store/store';
import withClient from '../../providers/with_client';

const AddServerOverlay = props => {
    const [busy, setBusy] = useState(false);
    const [provider, setProvider] = useState(null);
    const [regions, setRegions] = useState([]);
    const [, { setCurrentVPNServer, setVPNStatus, setLog }] = useStore();

    const cancel = () => {
        Navigation.dismissModal(props.componentId);
    };

    const fetchRegions = async _provider => {
        const _regions = await props.client.getRegions(_provider);

        setRegions(_regions);
        // setRegions(_regions.filter(r => r.available));
    };

    const addServer = region => () => {
        setBusy(true);
        Navigation.dismissOverlay(props.componentId);
        Navigation.dismissAllModals();
        setTimeout(async () => {
            try {
                console.log('add vpn server triggered.');
                setLog('VPN is not configured. Creating new VPN server.');
                setVPNStatus('Connecting');
                const server = await props.client.createServer(provider, region);
                setCurrentVPNServer(server);
            } catch (e) {
                setVPNStatus('Connect');
                setLog('Cannot create VPN server ', e);
            }
        }, 500);
    };

    const selectProvider = _provider => () => {
        setProvider(_provider);
        fetchRegions(_provider);
    };

    const renderProviderForm = () => {
        return <ProviderButton label={'Digital Ocean'} onPress={selectProvider('digitalocean')} />;
    };

    const renderRegionForm = () => {
        return (
            <ScrollView>
                {regions.map((region, id) => (
                    <View key={id}>
                        <TouchableOpacity onPress={addServer(region)} disabled={busy}>
                            <Text>{region.name}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'black', opacity: 0.5 }} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexWrap: 'wrap-reverse', padding: 15 }}>
                    <TouchableOpacity onPress={cancel}>
                        <Text style={{ fontSize: 15, lineHeight: 15 }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, padding: 15 }}>
                    {!provider && renderProviderForm()}
                    {provider && renderRegionForm()}
                </View>
            </SafeAreaView>
        </View>
    );
};

export default withClient(AddServerOverlay);
