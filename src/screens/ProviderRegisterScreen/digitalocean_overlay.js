import React, { useState } from 'react';
import DOCallbackHtml from '../../providers/DigitalOcean/do-api-callback.html.js';
import StaticServer from '../../static_server';
import SafariView from 'react-native-safari-view';
import { Button, Divider, Input, Overlay } from 'react-native-elements';
import { Text, TouchableOpacity, View } from 'react-native';

const DigitalOceanOverlay = () => {
    const [visible, setVisible] = useState(true);
    const [tokenInput, setTokenInput] = useState(false);
    const [token, setToken] = useState('');

    const toggleOverlay = () => {
        setVisible(!visible);
    };

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
        }).then(() => {
            toggleOverlay();
        });
    };

    const signUp = () => {
        SafariView.show({
            url: 'https://m.do.co/c/ad75f5779a2a',
            fromBottom: true,
        }).then(() => {
            toggleOverlay();
        });
    };

    const signInByToken = async () => {
        const html = DOCallbackHtml();
        const url = await StaticServer.serveHtml(html);

        SafariView.show({
            url: url + `#access_token=${token}`,
            fromBottom: true,
        }).then(() => {
            setTimeout(toggleOverlay, 500);
        });
    };

    const toggleTokenInput = () => {
        setTokenInput(!tokenInput);
    };

    if (tokenInput) {
        return (
            <Overlay
                overlayStyle={{ alignSelf: 'stretch', marginHorizontal: 12 }}
                isVisible={visible}
                onBackdropPress={toggleOverlay}>
                <View>
                    <Text style={{ fontSize: 18, alignSelf: 'center' }}>Connect a DigitalOcean Account</Text>
                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                    <Text style={{ marginBottom: 15 }}>
                        If you already have a token for DigitalOcean API, provide here to start deploying your own VPN
                        server.
                    </Text>
                    <Input
                        leftIcon={{ type: 'material-community', name: 'account-key-outline' }}
                        label={'Personal Access Token'}
                        placeholder={''}
                        onChangeText={value => setToken(value)}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            containerStyle={{ flex: 1 }}
                            icon={{ type: 'font-awesome-5', name: 'digital-ocean' }}
                            type={'outline'}
                            raised={true}
                            onPress={() => signInByToken()}
                            title={'Sign in'}
                        />
                        <Button type={'clear'} title={'Back'} onPress={() => toggleTokenInput()} />
                    </View>
                </View>
            </Overlay>
        );
    }

    return (
        <Overlay
            overlayStyle={{ alignSelf: 'stretch', marginHorizontal: 12 }}
            isVisible={visible}
            onBackdropPress={toggleOverlay}>
            <View>
                <Text style={{ fontSize: 18, alignSelf: 'center' }}>Connect a DigitalOcean Account</Text>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <Text style={{ marginBottom: 15 }}>
                    ZudVPN uses DigitalOcean API to create a VPN server. Choose a step to sign in to DigitalOcean and
                    start deploying your own VPN server.
                </Text>
                <Button
                    icon={{ type: 'font-awesome-5', name: 'digital-ocean' }}
                    type={'outline'}
                    raised={true}
                    title={'Sign in with DigitalOcean'}
                    onPress={() => signIn()}
                />
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <TouchableOpacity onPress={() => signUp()}>
                    <Text>Don't have an account?</Text>
                    <Text>
                        <Text style={{ textDecorationLine: 'underline' }}>Tap here</Text> for a free $100 credit on
                        DigitalOcean using our referral!
                    </Text>
                </TouchableOpacity>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <TouchableOpacity onPress={() => toggleTokenInput()}>
                    <Text>Do you have a personal access token?</Text>
                    <Text>
                        <Text style={{ textDecorationLine: 'underline' }}>Tap here</Text> to sign in using a token.
                    </Text>
                </TouchableOpacity>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
            </View>
        </Overlay>
    );
};

export default DigitalOceanOverlay;
