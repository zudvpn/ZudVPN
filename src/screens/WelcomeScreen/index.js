import React, { Component } from 'react'
import { Button, Dimensions, Linking, Platform, Text, TouchableOpacity, View } from 'react-native'
import SafariView from 'react-native-safari-view'
import AsyncStorage from '@react-native-community/async-storage'
import RNNetworkExtension from 'react-native-network-extension'
import Deploy from './../../providers/DigitalOcean/deploy'
import StaticServer from 'react-native-static-server'
import RNFS from 'react-native-fs'
import VPNMobileConfig from './../../vpn.mobileconfig'
import InstallVPNConfiguration from '../../install-vpn-configuration';
import notification from '../../notification_core'

const ACCESS_TOKEN_DATA = 'ACCESS_RESPONSE';

class Welcome extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedServer: null,
            tokenData: null,
            status: 'Disconnected',
            logs: []
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

        this.vpnStatusListener = RNNetworkExtension.addEventListener('status', this.networkStatusCallback)

        this.vpnFailListener = RNNetworkExtension.addEventListener('fail', this.networkFailCallback)

        AsyncStorage.getItem(ACCESS_TOKEN_DATA).then(value => {
            if (value !== null) {
                const tokenData = JSON.parse(value)
                this.setState({ tokenData })
            }
        })
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleCallbackEvent)

        this.vpnStatusListener.remove()
        RNNetworkExtension.removeEventListener('status', this.networkStatusCallback)

        this.vpnFailListener.remove()
        RNNetworkExtension.removeEventListener('fail', this.networkFailCallback)
    }

    networkStatusCallback = status => {
        console.log('newtork status: ', status)
        this.setState({status})
    }

    networkFailCallback = reason => {
        console.log('network fail reason: ', reason)
        this.setState({status: 'Connect'})
    }

    handleCallback = (url) => {
        console.log('The callback url received', url)
        let result = url.split('?')[1].split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        if (Object.keys(result).length > 0 && result.hasOwnProperty('access_token')) {
            AsyncStorage.setItem(ACCESS_TOKEN_DATA, JSON.stringify(result))
            this.setState({ tokenData: result })
        }

        SafariView.dismiss()
    }

    handleCallbackEvent = (event) => {
        this.handleCallback(event.url)
    }

    installConfig = async (vpnData) => {
        let config = VPNMobileConfig('ZudVPN', vpnData)
        
        await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/config', {NSURLIsExcludedFromBackupKey: true})
            
        let html = InstallVPNConfiguration(config)

        let html_path = RNFS.DocumentDirectoryPath + '/config/install-vpn-configuration.html'

        await RNFS.writeFile(html_path, html, 'utf8')

        let url = await this.staticServer.isRunning() ? this.staticServer.origin : await this.staticServer.start()

        SafariView.show({
            url: url + '/install-vpn-configuration.html',
            fromBottom: true
        }).then(() => {
            this.setState({status: 'Connect'})
            // RNNetworkExtension.connect({
            //     IPAddress: vpnData.ipAddress,
            //     clientCert: vpnData.privateKeyCertificate,
            //     clientCertKey: vpnData.privateKeyPassword
            // })
        })
    }

    configureVPN = async () => {
        console.log('Installing VPN configuration')
        this.setLog('Installing VPN configuration')
        try {
            deploy = new Deploy(this.state.tokenData.access_token, 'fra1', this.setLog)
            let vpnData = await deploy.run()
            // this.installConfig(vpnData)
            await RNNetworkExtension.configure({
                ipAddress: vpnData.ipAddress,
                domain: vpnData.domain,
                username: "vpn",
                password: vpnData.password
            })
        } catch (e) {
            this.setState({status:'Disconnected'})
            console.warn(e)
            this.setLog('ERROR:', e)
        }
    }

    triggerVPN = async () => {
        if (this.state.status === 'Connected') {
            console.log('stopping vpn')
            RNNetworkExtension.disconnect()
        } else {
            this.setState({status:'Connecting'})
            console.log('triggered vpn')

            try {
                await RNNetworkExtension.connect()
            } catch (e) {
                console.log('VPN connect error', e)
                this.configureVPN()
            }
        }
    }

    triggerProviderSelectScreenModal = () => {
        this.props.ProviderSelectScreenModal(this.staticServer)
    }

    triggerServerSelectScreen = () => {
        this.props.ServerSelectScreenModel(this.state.tokenData.access_token, this.configureVPN)
    }

    setLog = (...message) => {
        notification.log(message)
        const logs = [...notification.logs()]
        this.setState({ logs: logs.reverse() })
    }

    render() {
        const { tokenData, logs } = this.state

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


        let label = this.state.status
        switch (this.state.status) {
            case 'Connected':
                label = 'Disconnect'
                break;
            case 'Disconnected':
                label = 'Connect'
                break;
        }

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
                    disabled={disabled}
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
                        }}>{label}</Text>
                </TouchableOpacity>
                <View style={{marginTop: 10, marginBottom: 10}}>
                    <TouchableOpacity
                    onPress={this.triggerServerSelectScreen}
                    style={{
                        borderColor: '#0069ff',
                        borderWidth: 1,
                        borderRadius: 3,
                        width: '100%',
                        alignItems: 'center',
                        padding: 15
                    }}>
                        <Text style={{position: 'absolute', alignSelf: 'flex-start', fontSize: 9, margin: 2}}>Current VPN server:</Text>
                        <Text style={{
                            color: '#0069ff', 
                            fontWeight: '500', 
                            fontSize: 14
                            }}>DigitalOcean Frankfurt-1</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={this.props.LogFileViewerScreenModal}>
                        {logs.map((log, index) => <Text selectable={true} key={index}>{log}</Text>)}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default Welcome