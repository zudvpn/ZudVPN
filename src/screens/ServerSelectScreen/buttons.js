import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export const SegmentButton = ({label, labelStyle, onPress}) => (
    <TouchableOpacity 
        onPress={onPress}
        style={{
            flex: 1,
            padding: 10,
            alignItems: 'center'
        }}>
        <Text style={labelStyle}>{label}</Text>
    </TouchableOpacity>
)

export const AddButton = ({onPress}) => (
    <TouchableOpacity onPress={onPress}>
        <Text>Add server</Text>
    </TouchableOpacity>
)