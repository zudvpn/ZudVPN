import React from 'react';
import DigitalOceanLogin from './digitalocean_login';
import { Provider } from 'providers/types/Provider';

interface Props {
    provider: Provider;
}

const ProviderRegisterScreen = (props: Props) => {
    if (props.provider.id === 'digitalocean') {
        return <DigitalOceanLogin {...props} />;
    }

    return <></>;
};

export default ProviderRegisterScreen;
