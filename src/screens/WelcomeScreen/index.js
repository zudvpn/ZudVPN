import React, { Component } from 'react'
import { Linking, Platform, Text, TouchableOpacity, View } from 'react-native'
import SafariView from 'react-native-safari-view'
import AsyncStorage from '@react-native-community/async-storage'
import RNNetworkExtension from 'react-native-network-extension'
import Deploy from './../../providers/DigitalOcean/deploy'
import notification from '../../notification_core'
import styles from './style'
import { RoundButton, IconButton } from './buttons'
import { Navigation } from 'react-native-navigation';
import StaticServer from './../../static_server'

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

        StaticServer.stop()
        Navigation.dismissAllModals()
        SafariView.dismiss()
    }

    handleCallbackEvent = (event) => {
        this.handleCallback(event.url)
    }

    configureVPN = async () => {
        console.log('Configuring VPN...')
        this.setLog('Configuring VPN...')
        try {
            deploy = new Deploy(this.state.tokenData.access_token, 'fra1', this.setLog)
            let vpnData = await deploy.run()
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
                this.setLog('VPN is not configured. Creating new VPN server.')
                this.setState({status:'Connecting'})
                this.configureVPN()
            }
        }
    }

    triggerProviderRegisterScreenModal = () => {
        this.props.ProviderRegisterScreenModal()
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
                <View style={styles.container}>
                    <View style={styles.curtain}></View>
                    <Text style={styles.logo}>Zud VPN</Text>
                    <RoundButton label={'Get Started!'} onPress={this.triggerProviderRegisterScreenModal}/>
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
            <View style={styles.container}>
                <View style={styles.curtain}></View>
                <Text style={styles.logo}>Zud VPN</Text>
                <RoundButton label={label} onPress={this.triggerVPN} disabled={disabled}/>
                <View style={{marginTop: 10, marginBottom: 10}}>
                    <IconButton label={'Frankfurt-1'} onPress={this.triggerServerSelectScreen}/>
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