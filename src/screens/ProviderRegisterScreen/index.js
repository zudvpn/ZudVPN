import React from 'react';
import DigitalOceanOverlay from './digitalocean_overlay';

const ProviderRegisterScreen = props => {
    if (props.provider.id === 'digitalocean') {
        return <DigitalOceanOverlay />;
    }
};

export default ProviderRegisterScreen;
