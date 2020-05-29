import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useStore } from '../../store/store';

const Notifications = () => {
    const [{ notifications }] = useStore();

    return (
        notifications.length > 0 && (
            <View style={{ alignItems: 'center' }}>
                {notifications.slice(0, 5).map((notification, i) => {
                    return (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {i === 0 && notification.type === 'progress' && <ActivityIndicator />}
                            <Text style={{ fontSize: 14 - i, opacity: 1 - (2.0 * i) / 10, textAlign: 'center' }}>
                                {' '}
                                {notification.notification}
                            </Text>
                        </View>
                    );
                })}
            </View>
        )
    );
};

export default Notifications;
