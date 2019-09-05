import React, { Component } from 'react'
import { Text, SafeAreaView, View, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation';
import RNFS from 'react-native-fs'
import DOCallbackHtml from '../../providers/DigitalOcean/do-api-callback.html.js'
import SafariView from 'react-native-safari-view'

class ProviderSelectScreen extends Component {
    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Get Started!'
                },
                leftButtons: [],
                rightButtons: [
                    {
                        id: 'cancel',
                        text: 'Cancel'
                    }
                ]
            }
        }
    }

    constructor(props) {
        super(props)
        Navigation.events().bindComponent(this)
    }

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'cancel') {
            Navigation.dismissModal(this.props.componentId)
        }
    }

    signInWithDO = async () => {
        await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/config', {NSURLIsExcludedFromBackupKey: true})
        const path = RNFS.DocumentDirectoryPath + '/config/do-api-callback.html'

        const html = DOCallbackHtml()

        await RNFS.writeFile(path, html, 'utf8')

        let url = await this.props.staticServer.isRunning() ? this.props.staticServer.origin : await this.props.staticServer.start()

        console.log('The DO redirect uri', url)

        SafariView.show({
            url: `https://cloud.digitalocean.com/v1/oauth/authorize?response_type=token` +
            `&client_id=8d60106cd9109861ce841d4d8cfcc3477a10757f2919601a36873d25be226904` +
            `&redirect_uri=${url}/do-api-callback.html` +
            `&scope=read%20write`,
            fromBottom: true
        })
    }

    registerWithDO = () => {
        SafariView.show({
            url: `https://m.do.co/c/ad75f5779a2a`,
            fromBottom: true
        })
    }

    render() {
        return (    
        <SafeAreaView style={{
            flex:1,
            margin: 10
            }}>
                <View style={{margin: 10, marginBottom: 80}}>
                    <Text>
                        Hello, it looks like you haven't created any personal VPN servers yet. 
                        Choose the provider you want to create your personal VPN on.
                    </Text>
                </View>
                <View style={{margin: 10}}>
                    <Text>VPN Providers:</Text>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={this.signInWithDO}
                        style={{
                            borderColor: '#0069ff',
                            borderWidth: 1,
                            borderRadius: 3,
                            width: '100%',
                            alignItems: 'center',
                            padding: 20
                        }}
                    >
                        <Text style={{
                            color: '#0069ff', 
                            fontWeight: '500', 
                            fontSize: 22
                            }}>DigitalOcean</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.registerWithDO}
                        style={{
                            padding: 5
                        }}
                    >
                        <Text style={{alignSelf: 'center', fontSize:11}}>Don't have an account? Tap for free $50 credit on DigitalOcean!</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 20}}></View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity activeOpacity={0.5} style={{
                        opacity: 0.7,
                        borderColor: '#efefef',
                        borderWidth: 1,
                        borderRadius: 3,
                        width: '100%',
                        alignItems: 'center',
                        padding: 20
                        }}
                    >
                        <Text style={{fontSize: 22}}>Amazon Web Services</Text>
                        <Text style={{padding: 5, alignSelf: 'flex-end', position: 'absolute', fontSize: 11}}>(coming soon!)</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
        )
    }
}

export default ProviderSelectScreen