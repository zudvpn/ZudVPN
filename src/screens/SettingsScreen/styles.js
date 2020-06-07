import React from 'react';
import { StyleSheet } from 'react-native';
import { COLOR_SECONDARY, COLOR_TERTIARY } from '../../theme';

export default StyleSheet.create({
    server_container: {
        borderColor: COLOR_TERTIARY,
        borderWidth: 1,
        borderRadius: 3,
        margin: 20,
    },
    button_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: COLOR_TERTIARY,
        alignItems: 'center',
    },
    button_separator: {
        height: '100%',
        borderWidth: 0.5,
        borderColor: COLOR_TERTIARY,
    },
    section_title: {
        color: COLOR_SECONDARY,
        fontSize: 12,
        padding: 15,
        paddingBottom: 2,
    },
});
