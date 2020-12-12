import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLOR_SECONDARY } from '../../theme';

interface Props {
    label: string;
    onPress: any;
    labelStyle?: object;
}

export const SegmentButton = ({ label, labelStyle, onPress }: Props) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            flex: 1,
            padding: 10,
            alignItems: 'center',
        }}>
        <Text style={[{ color: COLOR_SECONDARY }, labelStyle]}>{label}</Text>
    </TouchableOpacity>
);

export const AddButton = ({ onPress }: { onPress: any }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            flex: 1,
            padding: 10,
            alignItems: 'center',
            borderColor: '#0069ff',
            borderWidth: 1,
            margin: 10,
            borderRadius: 3,
        }}>
        <Text style={{ color: '#0069ff', fontSize: 15 }}>Add Server</Text>
    </TouchableOpacity>
);
