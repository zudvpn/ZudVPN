import React, { Component } from 'react'
import { Text, SafeAreaView, View, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation';
import notification from './notification_core'

class LogFileViewerScreen extends Component {
    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Log Viewer'
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
        this.state = {
            contents: null
        }
    }

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'cancel') {
            Navigation.dismissModal(this.props.componentId)
        }
    }

    componentDidMount() {
        // notification.read_log_file().then((contents) => {
        //     this.setState({
        //         contents
        //     })
        // })        
    }

    render() {
        const { contents } = this.state

        return (
            <SafeAreaView>
                <Text>{contents}</Text>
            </SafeAreaView>
        )
    }
}

export default LogFileViewerScreen