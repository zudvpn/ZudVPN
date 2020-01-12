import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { INITIAL_STATE_KEY, useStore } from './store';
import AsyncStorage from '@react-native-community/async-storage';

const withInitState = Component => () => {
    const [loading, setLoading] = useState(true);
    const [, { initState }] = useStore();

    useEffect(() => {
        const init = async () => {
            console.log('Initializing state');

            const state = await AsyncStorage.getItem(INITIAL_STATE_KEY);

            if (state === null) {
                console.log('Initial state is not present');
            } else {
                const parsed_state = JSON.parse(state);
                console.log('parsed state', parsed_state);
                initState(parsed_state);
            }

            setLoading(false);
        };

        init();
    }, []);

    return <View>{loading ? <Text>Loading...</Text> : <Component />}</View>;
};

export default withInitState;
