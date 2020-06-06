import React from 'react';
import DigitalOceanLogin from './digitalocean_login';

const ProviderRegisterScreen = props => {
    if (props.provider.id === 'digitalocean') {
        return <DigitalOceanLogin {...props} />;
    }
};

export default ProviderRegisterScreen;
