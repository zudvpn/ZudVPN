import React from 'react'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    server_container: {
        borderColor: '#0069ff',
        borderWidth: 1,
        borderRadius: 3,
        margin: 20
    },
    button_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#0069ff',
        alignItems: 'center'
    },
    button_separator: {
        height: '100%',
        borderWidth: 0.5,
        borderColor: '#0069ff'
    }
})