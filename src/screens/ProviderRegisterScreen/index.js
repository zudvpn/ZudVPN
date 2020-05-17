import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import DOCallbackHtml from '../../providers/DigitalOcean/do-api-callback.html.js';
import SafariView from 'react-native-safari-view';
import StaticServer from '../../static_server';
import { Button, Divider, Input, Overlay } from 'react-native-elements';

const ProviderRegisterScreen = props => {
    const [visible, setVisible] = useState(true);
    const [token, setToken] = useState('');

    const toggleOverlay = () => {
        setVisible(!visible);
        // Navigation.dismissModal(props.componentId);
    };

    const signInWithDO = async () => {
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

    const signUpWithDO = () => {
        SafariView.show({
            url: 'https://m.do.co/c/ad75f5779a2a',
            fromBottom: true,
        });
    };

    const signInByTokenWithDO = async () => {
        const html = DOCallbackHtml();
        const url = await StaticServer.serveHtml(html);

        SafariView.show({
            url: url + `#access_token=${token}`,
            fromBottom: true,
        });
    };

    const signIn = () => {
        if (props.provider.id === 'digitalocean') {
            signInWithDO();
        }

        toggleOverlay();
    };

    const signUp = () => {
        if (props.provider.id === 'digitalocean') {
            signUpWithDO();
        }

        toggleOverlay();
    };

    const signInByToken = () => {
        if (props.provider.id === 'digitalocean') {
            signInByTokenWithDO();
        }

        toggleOverlay();
    };

    return (
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <View>
                <Button raised={true} title={`Sign in with ${props.provider.name}`} onPress={() => signIn()} />
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <TouchableOpacity onPress={() => signUp()}>
                    <Text>Don't have an account?</Text>
                    <Text>
                        <Text style={{ textDecorationLine: 'underline' }}>Tap here</Text> for a free $100 credit on
                        DigitalOcean using our referral!
                    </Text>
                </TouchableOpacity>
                <Divider style={{ marginTop: 15, marginBottom: 15 }} />
                <Text>Do you have a personal access token?</Text>
                <Text>Provide here without signing in:</Text>
                <Input placeholder={'Token'} onChangeText={value => setToken(value)} />
                <Button onPress={() => signInByToken()} title={'Submit'} />
            </View>
        </Overlay>
    );
};

export default ProviderRegisterScreen;
