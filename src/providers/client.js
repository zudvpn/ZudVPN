'use strict';

import DO_Client from './DigitalOcean/client_facade';
import RNNetworkExtension from 'react-native-network-extension';
import logger from '../logger';

class Client {
    constructor(tokens) {
        this.clients = {};

        for (const token of tokens) {
            this.clients[token.provider] = this.createClient(token.provider, token.access_token);
        }
    }

    createClient(provider, access_token) {
        if (provider === 'digitalocean') {
            return new DO_Client(access_token);
        }
    }

    async createServer(provider, region, notify) {
        const vpnData = await this.clients[provider].createServer(region, notify);

        notify('progress', 'Configuring authentication');
        await RNNetworkExtension.configure({
            ipAddress: vpnData.ipAddress,
            domain: vpnData.domain,
            username: vpnData.username,
            password: vpnData.password,
        });

        return vpnData.server;
    }

    async getRegions(provider) {
        try {
            return await this.clients[provider].getRegions();
        } catch (e) {
            logger.warn([`Cannot load ${provider} regions`, e.message]);
        }

        return [];
    }

    async getServers() {
        const requests = Object.values(this.clients).map(client => client.getServers().catch(e => e));

        const responses = await Promise.all(requests);

        return responses
            .filter(response => {
                if (response instanceof Error) {
                    logger.warn('Retrieving servers failed, reason: ' + response.message);

                    return false;
                }

                return true;
            })
            .flat();
    }

    async deleteServer(server) {
        await this.clients[server.provider.id].deleteServer(server);
    }
}

export default Client;
