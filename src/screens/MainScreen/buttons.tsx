import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { BACKGROUND_PRIMARY, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_TERTIARY } from '../../theme';

interface ButtonProps {
    label: string;
    onPress: any;
}

interface RadioButtonProps extends ButtonProps
{
    disabled?: boolean;
}

export const RoundButton = ({ label, onPress, disabled = false }: RadioButtonProps) => (
    <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: BACKGROUND_PRIMARY,
            borderColor: COLOR_PRIMARY,
            borderWidth: 5,
            padding: 5,
            height: 200,
            width: 200,
            borderRadius: 400,
        }}>
        <Text
            style={{
                color: COLOR_PRIMARY,
                fontSize: 18,
            }}>
            {label}
        </Text>
    </TouchableOpacity>
);

export const IconButton = ({ label, onPress }: ButtonProps) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            borderColor: COLOR_TERTIARY,
            borderWidth: 1,
            borderRadius: 3,
            width: '100%',
            alignItems: 'center',
            padding: 15,
        }}>
        <Text style={{ color: COLOR_SECONDARY, position: 'absolute', alignSelf: 'flex-start', fontSize: 9, margin: 2 }}>
            Current VPN server:
        </Text>
        <Text
            style={{
                color: COLOR_TERTIARY,
                fontWeight: '500',
                fontSize: 14,
            }}>
            {label}
        </Text>
    </TouchableOpacity>
);
