import React, { useState } from 'react';
import DOCallbackHtml from '../../providers/DigitalOcean/do-api-callback-html';
import StaticServer from '../../static_server';
// @ts-ignore
import SafariView from 'react-native-safari-view';
import { Button, colors, Divider, Input } from 'react-native-elements';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import useScreen from '../useScreen';
import { BACKGROUND_PRIMARY, BACKGROUND_SECONDARY, COLOR_SECONDARY } from '../../theme';

const DigitalOceanLogin = (props: any) => {
    const [token, setToken] = useState<string>('');
    const { ProviderRegisterScreenPush } = useScreen();

    const signIn = async () => {
        const html = DOCallbackHtml();
        const url = await StaticServer.serveHtml(html);

        SafariView.show({
            url:
                'https://cloud.digitalocean.com/v1/oauth/authorize?response_type=token' +
                '&client_id=8d60106cd9109861ce841d4d8cfcc3477a10757f2919601a36873d25be226904' +
                `&redirect_uri=${url}` +
                '&scope=read%20write',
            fromBottom: true,
        });
    };

    const signInByToken = async () => {
        const html = DOCallbackHtml();
        const url = await StaticServer.serveHtml(html);

        if (token.length === 0) {
            return;
        }

        SafariView.show({
            url: url + `#access_token=${token}`,
            fromBottom: true,
        });
    };

    const toggleTokenInput = () => {
        ProviderRegisterScreenPush({ ...props, tokenInput: true });
    };

    if (props.tokenInput) {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_PRIMARY }}>
                <Text style={{ color: COLOR_SECONDARY, marginVertical: 15, fontSize: 18, alignSelf: 'center' }}>
                    Connect a DigitalOcean Account
                </Text>
                <Divider />
                <View style={{ backgroundColor: BACKGROUND_SECONDARY }}>
                    <Text style={{ color: COLOR_SECONDARY, margin: 15 }}>
                        Provide your personal DigitalOcean API access token to start deploying VPN servers.
                    </Text>
                </View>
                <Input
                    containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }}
                    leftIcon={{ type: 'material-community', name: 'account-key-outline', color: COLOR_SECONDARY }}
                    label={'Personal Access Token'}
                    inputStyle={{ color: COLOR_SECONDARY }}
                    placeholder={'Type or paste here'}
                    onChangeText={(value) => setToken(value)}
                />
                <View style={{ margin: 15 }}>
                    <Button
                        buttonStyle={{ backgroundColor: BACKGROUND_SECONDARY, borderColor: colors.divider }}
                        icon={{ type: 'font-awesome-5', name: 'digital-ocean', color: '#008bcf' }}
                        type={'outline'}
                        raised={true}
                        onPress={() => signInByToken()}
                        title={'Sign in'}
                        titleStyle={{ color: COLOR_SECONDARY }}
                    />
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_PRIMARY }}>
            <Text style={{ color: COLOR_SECONDARY, marginVertical: 15, fontSize: 18, alignSelf: 'center' }}>
                Connect a DigitalOcean Account
            </Text>
            <Divider />
            <View style={{ backgroundColor: BACKGROUND_SECONDARY }}>
                <Text style={{ color: COLOR_SECONDARY, margin: 15 }}>
                    ZudVPN uses DigitalOcean API to create a VPN server. Choose a step to sign in to DigitalOcean
                    account. After the sign-in, you will be provided a list of regions to host your VPN server.
                </Text>
            </View>
            <Divider />
            <View style={{ margin: 15 }}>
                <Button
                    buttonStyle={{ backgroundColor: BACKGROUND_SECONDARY, borderColor: colors.divider }}
                    icon={{ type: 'font-awesome-5', name: 'digital-ocean', color: '#008bcf' }}
                    type={'outline'}
                    raised={true}
                    title={'Sign in with DigitalOcean'}
                    titleStyle={{ color: COLOR_SECONDARY }}
                    onPress={() => signIn()}
                />
            </View>
            <Divider />
            <View style={{ backgroundColor: BACKGROUND_SECONDARY }}>
                <TouchableOpacity style={{ margin: 15 }} onPress={() => toggleTokenInput()}>
                    <Text style={{ color: COLOR_SECONDARY }}>Do you have a personal access token?</Text>
                    <Text style={{ color: COLOR_SECONDARY }}>
                        <Text style={{ textDecorationLine: 'underline', color: COLOR_SECONDARY }}>Tap here</Text> to
                        sign in using a token.
                    </Text>
                </TouchableOpacity>
            </View>
            <Divider />
        </ScrollView>
    );
};

export default DigitalOceanLogin;
