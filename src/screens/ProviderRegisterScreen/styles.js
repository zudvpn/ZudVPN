import React from 'react'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    button: {
        borderColor: '#0069ff',
        borderWidth: 1,
        borderRadius: 3,
        width: '100%',
        alignItems: 'center',
        padding: 20
    },
    button_label: {
        color: '#0069ff', 
        fontWeight: '500', 
        fontSize: 22
    },
    button_sublabel: {
        padding: 5,
        alignSelf: 'flex-end',
        position: 'absolute',
        fontSize: 11
    }
})