import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { INITIAL_STATE_KEY, useStore } from './store';
import AsyncStorage from '@react-native-community/async-storage';
import logger from '../logger';

const withInitState = Component => props => {
    const [loading, setLoading] = useState(true);
    const [, { initState }] = useStore();

    useEffect(() => {
        const init = async () => {
            logger.debug('Initializing state');

            const state = await AsyncStorage.getItem(INITIAL_STATE_KEY);

            if (state === null) {
                logger.debug('Initial state is not present');
            } else {
                const parsed_state = JSON.parse(state);
                logger.debug(['parsed state', parsed_state]);
                initState(parsed_state);
            }

            setLoading(false);
        };

        init();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={'large'} /> : <Component />}
        </View>
    );
};

export default withInitState;
