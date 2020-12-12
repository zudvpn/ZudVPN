import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, ScrollView, Text } from 'react-native';
import RegionListItem from './region_list_item';
import withClient from '../../../providers/with_client';
import { Navigation } from 'react-native-navigation';
import { useStore } from '../../../store/store';
import { BACKGROUND_PRIMARY, COLOR_SECONDARY } from '../../../theme';

const ProviderRegionScreen = (props: any) => {
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
            <SafeAreaView
                style={{
                    backgroundColor: BACKGROUND_PRIMARY,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator size={'large'} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_PRIMARY }}>
            <Text
                style={{
                    color: COLOR_SECONDARY,
                    fontSize: 18,
                    alignSelf: 'center',
                    padding: 10,
                    paddingBottom: 0,
                }}>
                Regions on {props.provider.name}
            </Text>
            <Text style={{ color: COLOR_SECONDARY, alignSelf: 'center', marginBottom: 10 }}>
                Select a region to deploy a VPN server on
            </Text>
            <FlatList
                data={regions}
                renderItem={({ item }) => <RegionListItem provider={props.provider} item={item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeAreaView>
    );
};

export default withClient(ProviderRegionScreen);
