import React from 'react';
import styles from './style';
import LinkingListener from './linking_listener';
import { Text, View } from 'react-native';

const Layout = (props) => {
    return (
        <LinkingListener>
            <View style={styles.container}>
                <View style={styles.curtain} />
                <Text style={styles.logo}>ZudVPN</Text>
                {props.children}
            </View>
        </LinkingListener>
    );
};

export default Layout;
