import React from 'react';
import { useStore } from '../store/store';
import Client from './client';

const withClient = (Component: any) => (props: any) => {
    const [{ providerTokens }] = useStore();

    const client = new Client(providerTokens);

    return <Component client={client} {...props} />;
};

export default withClient;
