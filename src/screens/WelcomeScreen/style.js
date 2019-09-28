import React from 'react'
import { Dimensions, StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {                    
        flex:1, 
        alignItems: 'center',
        position: 'relative',
        paddingTop: '70%'
    },
    curtain: {
        flex: 1,
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').width * 2,
        position: 'absolute',
        backgroundColor: '#C4DBF6',
        borderBottomStartRadius: Dimensions.get('window').height,
        borderBottomEndRadius: Dimensions.get('window').height,
    },
    logo: {
        position: 'absolute',
        top: 50,        
        color: 'black'
    },

})