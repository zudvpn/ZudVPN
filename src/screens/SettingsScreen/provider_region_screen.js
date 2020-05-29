import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, ScrollView, Text } from 'react-native';
import RenderProviderRegion from './render_provider_region';
import withClient from '../../providers/with_client';
import { Navigation } from 'react-native-navigation';
import { useStore } from '../../store/store';

const ProviderRegionScreen = props => {
    const [regions, setRegions] = useState(null);
    const [, { triggerSignOut }] = useStore();

    Navigation.events().registerNavigationButtonPressedListener(({ buttonId, componentId }) => {
        if (componentId === props.componentId && buttonId === 'sign_out') {
            Alert.alert('Warning!', `Are you sure you want to sign out of ${props.provider.name}?`, [
                {
                    text: 'Sign out',
                    onPress: () => {
                        triggerSignOut(props.provider);
                        Navigation.pop(props.componentId);
                    },
                    style: 'destructive',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]);
        }
    });

    const retrieveRegions = async () => {
        const _regions = await props.client.getRegions(props.provider.id);

        setRegions(_regions);
    };

    if (regions === null) {
        retrieveRegions();

        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <Text style={{ fontSize: 18, alignSelf: 'center', padding: 10, paddingBottom: 0 }}>
                    Regions on {props.provider.name}
                </Text>
                <Text style={{ alignSelf: 'center' }}>Select a region to deploy a VPN server on</Text>
                <FlatList
                    data={regions}
                    renderItem={({ item }) => <RenderProviderRegion provider={props.provider} item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default withClient(ProviderRegionScreen);
