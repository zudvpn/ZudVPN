import React, { Component } from 'react';
import { ScrollView, Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import DOCallbackHtml from '../../providers/DigitalOcean/do-api-callback.html.js';
import SafariView from 'react-native-safari-view';
import StaticServer from '../../static_server';
import { ProviderButton } from './buttons';

class ProviderRegisterScreen extends Component {
    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Zud VPN',
                },
                leftButtons: [],
                rightButtons: [
                    {
                        id: 'cancel',
                        text: 'Cancel',
                    },
                ],
            },
        };
    }

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({ buttonId }) {
        if (buttonId === 'cancel') {
            Navigation.dismissModal(this.props.componentId);
        }
    }

    signInWithDO = async () => {
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

    registerWithDO = () => {
        SafariView.show({
            url: 'https://m.do.co/c/ad75f5779a2a',
            fromBottom: true,
        });
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1, margin: 10 }}>
                <ScrollView>
                    <Text style={{ alignSelf: 'center' }}>Get Started!</Text>
                    <View style={{ margin: 10, marginBottom: 80 }}>
                        <Text>
                            Hello, in order to create your very own personal VPN server please choose your desired Cloud
                            Provider.
                        </Text>
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text>VPN Providers:</Text>
                    </View>
                    <View>
                        <ProviderButton onPress={this.signInWithDO} label={'Digital Ocean'} />
                        <TouchableOpacity onPress={this.registerWithDO} style={{ padding: 10 }}>
                            <Text style={{ fontSize: 13 }}>Don't have an account?</Text>
                            <Text style={{ fontSize: 13 }}>
                                <Text style={{ textDecorationLine: 'underline' }}>Tap here</Text> for a free $100 credit
                                on DigitalOcean using our referral!
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 20 }} />
                    <View style={{ flexDirection: 'row' }}>
                        <ProviderButton
                            onPress={f => f}
                            label={'Amazon Web Services'}
                            sublabel={'coming soon!'}
                            labelStyle={{ color: '#000' }}
                            buttonStyle={{ opacity: 0.7, borderColor: '#efefef' }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default ProviderRegisterScreen;
