import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { BACKGROUND_PRIMARY, BACKGROUND_SECONDARY, COLOR_PRIMARY } from '../../theme';

export default StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        position: 'relative',
        paddingTop: '70%',
        backgroundColor: BACKGROUND_PRIMARY,
    },
    curtain: {
        flex: 1,
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').width * 2,
        position: 'absolute',
        backgroundColor: BACKGROUND_SECONDARY,
        borderBottomStartRadius: Dimensions.get('window').height,
        borderBottomEndRadius: Dimensions.get('window').height,
    },
    logo: {
        color: COLOR_PRIMARY,
        position: 'absolute',
        top: 50,
    },
});
