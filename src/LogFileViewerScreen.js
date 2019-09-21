import React, { Component } from 'react'
import { Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
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
        this.setState({
            contents: [...notification.logs()].reverse()
        })
    }

    render() {
        const { contents } = this.state

        return (
            <SafeAreaView>
                <ScrollView>
                    {contents.map((log, index) => <Text selectable={true} key={index}>{log}</Text>)}
                </ScrollView>                
            </SafeAreaView>
        )
    }
}

export default LogFileViewerScreen