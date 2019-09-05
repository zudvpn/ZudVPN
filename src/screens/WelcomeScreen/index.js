import React, { Component } from 'react'
import { Button, Dimensions, Linking, Platform, Text, TouchableOpacity, View } from 'react-native'
import SafariView from 'react-native-safari-view'
import AsyncStorage from '@react-native-community/async-storage'
//import RNNetworkExtension from 'react-native-network-extension'
import Deploy from './../../providers/DigitalOcean/deploy'
import StaticServer from 'react-native-static-server'
import RNFS from 'react-native-fs'
import VPNMobileConfig from './../../vpn.mobileconfig'
import uuidv4 from 'uuid/v4'
import { ProviderSelectScreenModal } from './../../screens/screens';

class Welcome extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tokenData: null,
            status: 'Disconnected'
        }        

        this.staticServer = new StaticServer(8080, RNFS.DocumentDirectoryPath + '/config', {localOnly: true})
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.handleCallback(url)
            })
        } else {
            Linking.addEventListener('url', this.handleCallbackEvent)
        }

        //this.vpnStatusListener = RNNetworkExtension.addEventListener('status', this.networkStatusCallback)

        //this.vpnFailListener = RNNetworkExtension.addEventListener('fail', this.networkFailCallback)

        AsyncStorage.getItem('ACCESS_RESPONSE').then(value => {
            if (value !== null) {
                const parsed = JSON.parse(value)
                this.setState({ tokenData: parsed })
            }
        })
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleCallbackEvent)

        this.vpnStatusListener.remove()
        // RNNetworkExtension.removeEventListener('status', this.networkStatusCallback)

        this.vpnFailListener.remove()
        // RNNetworkExtension.removeEventListener('fail', this.networkFailCallback)
    }

    networkStatusCallback = status => {
        console.log('newtork status: ', status)
        this.setState({status})
    }

    networkFailCallback = reason => {
        console.log('network fail reason: ', reason)
    }

    handleCallback = (url) => {
        let result = url.split('?')[1].split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        if (Object.keys(result).length > 0) {
            AsyncStorage.setItem('ACCESS_RESPONSE', JSON.stringify(result))
            this.setState({ tokenData: result })
        }

        SafariView.dismiss()
    }

    handleCallbackEvent = (event) => {
        this.handleCallback(event.url)
    }

    installConfig = async (vpnData) => {
        await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/config', {NSURLIsExcludedFromBackupKey: true})
        let path = RNFS.DocumentDirectoryPath + '/config/vpn.mobileconfig';

        let config = VPNMobileConfig(
            'AnyVPN', 
            vpnData.ipAddress, 
            vpnData.privateKeyPassword, 
            vpnData.privateKeyCertificate, 
            vpnData.caCertificate, 
            vpnData.serverCertificate, 
            uuidv4(), 
            uuidv4(), 
            uuidv4(), 
            uuidv4(), 
            uuidv4(), 
            uuidv4()
        )

        await RNFS.writeFile(path, config, 'utf8')

        console.log('written config file', config)

        let url = await this.staticServer.isRunning() ? this.staticServer.origin : await this.staticServer.start()
        
        console.log('Serving url:', url)

        SafariView.show({
            url: url + '/vpn.mobileconfig',
            fromBottom: true
        }).then(() => {
            SafariView.dismiss()
            // RNNetworkExtension.connect({
            //     IPAddress: vpnData.ipAddress,
            //     clientCert: vpnData.privateKeyCertificate,
            //     clientCertKey: vpnData.privateKeyPassword
            // })
        })
    }

    triggerVPN = async () => {
        if (this.state.status === 'Connected') {
            console.log('stopping vpn')
            //RNNetworkExtension.disconnect()
        } else {
            this.setState({status:'Connecting'})
            console.log('triggered vpn')
            
            // @TODO SELECT REGION IF NOT SELECTED

            deploy = new Deploy(this.state.tokenData.access_token, 'fra1')
            let vpnData = await deploy.run()

            console.log('VPN DATA:', vpnData)

            this.installConfig(vpnData)

            // RNNetworkExtension.connect({
            //     IPAddress: vpnData.ipAddress,
            //     clientCert: vpnData.privateKeyCertificate,
            //     clientCertKey: vpnData.privateKeyPassword
            // })
        }
    }

    triggerProviderSelectScreenModal = () => {
        ProviderSelectScreenModal(this.staticServer)
    }

    render() {
        const { tokenData } = this.state

        console.log(tokenData)

        if (tokenData === null) {
            return (
                <View style={{                    
                    flex:1, 
                    alignItems: 'center',
                    position: 'relative',
                    paddingTop: '70%'
                    }}>
                    <View style={{
                        flex: 1,
                        height: Dimensions.get('window').width,
                        width: Dimensions.get('window').width * 2,
                        position: 'absolute',
                        backgroundColor: '#C4DBF6',
                        borderBottomStartRadius: Dimensions.get('window').height,
                        borderBottomEndRadius: Dimensions.get('window').height,
                    }}></View>
                    <Text style={{position: 'absolute', top: 50, color: 'black'}}>Zud VPN</Text>
                    <TouchableOpacity
                        onPress={this.triggerProviderSelectScreenModal}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#3B8BEB',
                            borderColor: '#E7E3D4',
                            borderColor: 'white',
                            borderWidth: 5,
                            padding: 5,
                            height: 200,
                            width: 200,
                            borderRadius: 400
                        }}
                    >
                        <Text style={{
                            color: 'white', 
                            fontSize: 18
                            }}>Connect</Text>
                    </TouchableOpacity>
                    <Text>
                        Get Started!
                    </Text>
                </View>
            )
        }
        
        let disabled = this.state.status == 'Connecting' || this.state.status == 'Disconnecting';

        return (
            <View style={{                    
                flex:1, 
                alignItems: 'center',
                position: 'relative',
                paddingTop: '70%'
                }}>
                <View style={{
                    flex: 1,
                    height: Dimensions.get('window').width,
                    width: Dimensions.get('window').width * 2,
                    position: 'absolute',
                    backgroundColor: '#C4DBF6',
                    borderBottomStartRadius: Dimensions.get('window').height,
                    borderBottomEndRadius: Dimensions.get('window').height,
                }}></View>
                <Text style={{position: 'absolute', top: 50, color: 'black'}}>Zud VPN</Text>
                <TouchableOpacity
                    onPress={this.triggerVPN}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#3B8BEB',
                        borderColor: '#E7E3D4',
                        borderColor: 'white',
                        borderWidth: 5,
                        padding: 5,
                        height: 200,
                        width: 200,
                        borderRadius: 400
                    }}
                >
                    <Text style={{
                        color: 'white', 
                        fontSize: 18
                        }}>{this.state.status == 'Connected' ? 'Disconnect' : 'Connect'}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Welcome