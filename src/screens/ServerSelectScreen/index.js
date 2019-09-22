import React, { Component } from 'react'
import { Alert, Text, SafeAreaView, View, ScrollView, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation';
import Client from '../../providers/DigitalOcean/do_client';

class ServerSelectScreen extends Component {
    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Servers'
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
        
        this.client = new Client(props.access_token)

        this.state = {
            servers: null
        }
    }

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'cancel') {
            Navigation.dismissModal(this.props.componentId)
        }
    }

    componentDidMount() {
        this.retrieveServers()
    }

    retrieveServers = async () => {
        // @todo get tag name from a constant
        let servers = await this.client.getDropletsByTag('zudvpn')

        servers = servers.map(droplet => {
            return {
                id: droplet.id,
                name: droplet.name,
                region: droplet.region.name,
                ipv4_address: droplet.networks.v4[0].ip_address
            }
        })

        this.setState({servers})
    }

    select = (reference) => () => {
        this.props.configureVPN()
        Navigation.dismissModal(this.props.componentId)
    }

    sshTerminal = (reference, ipv4_address) => () => {
        console.log('SSH connecting', reference)
        this.props.SSHTerminalScreenModal(reference, ipv4_address)
    }

    destroyConfirmed = (reference) => {
        this.client.deleteDroplet(reference)
        // remove deleted from servers
        this.setState({ servers: this.state.servers.filter(server => server.id !== reference)})
    }

    destroy = (reference) => () => {
        Alert.alert(
            '',
            'Are you sure you want to destroy this server? This action cannot be undone.',
            [
                {
                    text: 'Destroy',
                    onPress: () => this.destroyConfirmed(reference),
                    style: 'destructive'
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        )
    }

    renderServer = (server) => {
        return (
            <View
                key={server.id}
                style={{
                    borderColor: '#0069ff',
                    borderWidth: 1,
                    borderRadius: 3,
                    margin: 20
                }}>
                <TouchableOpacity 
                    onPress={this.select(server.id)}
                    style={{
                        padding: 15
                        }}>
                    <View>
                        <Text>{server.name} ({server.region})</Text>
                        <Text>{server.ipv4_address}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View 
                        style={{
                            flex: 1,
                            borderColor: '#0069ff',
                            borderTopWidth: 1,
                            borderRightWidth: 1,
                        }}>
                        <TouchableOpacity 
                            onPress={this.destroy(server.id)}
                            style={{
                                padding: 10,
                                alignItems: 'center'
                            }}>
                            <Text style={{color: 'red'}}>Destroy</Text>
                        </TouchableOpacity>
                    </View>
                    <View 
                        style={{
                            flex: 1,
                            borderColor: '#0069ff',
                            borderTopWidth: 1,
                            borderRightWidth: 1,
                        }}>
                        <TouchableOpacity 
                            onPress={this.sshTerminal(server.id, server.ipv4_address)}
                            style={{
                                padding: 10,
                                alignItems: 'center'
                            }}>
                            <Text>SSH Terminal</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            borderColor: '#0069ff',
                            flex: 1,
                            borderTopWidth: 1,
                        }}>
                        <TouchableOpacity 
                            onPress={this.select(server.id)}
                            style={{
                                padding: 10,
                                alignItems: 'center'
                            }}>
                            <Text>Select</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { servers } = this.state

        if (servers === null) {
            return (
                <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Loading...</Text>
                </SafeAreaView>
            )
        }

        if (servers.length === 0) {
            return (
                <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>No servers available.</Text>
                </SafeAreaView>
            )
        }

        return (
            <SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1}}>
                    {servers.map(server => this.renderServer(server))}
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default ServerSelectScreen