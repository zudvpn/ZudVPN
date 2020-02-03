import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';

export const ProviderButton = ({ label, labelStyle = {}, buttonStyle = {}, onPress, sublabel = '' }) => (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={[styles.button, buttonStyle]}>
        <Text style={[styles.button_label, labelStyle]}>{label}</Text>
        {sublabel != '' && <Text style={styles.button_sublabel}>{sublabel}</Text>}
    </TouchableOpacity>
);
