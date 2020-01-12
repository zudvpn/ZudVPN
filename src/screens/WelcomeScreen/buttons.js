import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const RoundButton = ({ label, onPress, disabled = false }) => (
    <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#3B8BEB',
            borderColor: 'white',
            borderWidth: 5,
            padding: 5,
            height: 200,
            width: 200,
            borderRadius: 400,
        }}>
        <Text
            style={{
                color: 'white',
                fontSize: 18,
            }}>
            {label}
        </Text>
    </TouchableOpacity>
);

export const IconButton = ({ label, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            borderColor: '#0069ff',
            borderWidth: 1,
            borderRadius: 3,
            width: '100%',
            alignItems: 'center',
            padding: 15,
        }}>
        <Text style={{ position: 'absolute', alignSelf: 'flex-start', fontSize: 9, margin: 2 }}>
            Current VPN server:
        </Text>
        <Text
            style={{
                color: '#0069ff',
                fontWeight: '500',
                fontSize: 14,
            }}>
            {label}
        </Text>
    </TouchableOpacity>
);
