import React from 'react';
import { useStore } from '../store/store';
import Client from './client';

const withClient = Component => props => {
    const [{ provider_tokens }, { setLog }] = useStore();

    const client = new Client(provider_tokens, setLog);

    return <Component client={client} {...props} />;
};

export default withClient;
