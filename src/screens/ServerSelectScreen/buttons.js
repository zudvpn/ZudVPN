import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const SegmentButton = ({ label, labelStyle, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            flex: 1,
            padding: 10,
            alignItems: 'center',
        }}>
        <Text style={labelStyle}>{label}</Text>
    </TouchableOpacity>
);

export const AddButton = ({ onPress }) => (
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
