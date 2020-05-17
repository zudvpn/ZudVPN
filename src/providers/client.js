'use strict';

import DO_Client from './DigitalOcean/client_facade';
import RNNetworkExtension from 'react-native-network-extension';

class Client {
    constructor(tokens, logger) {
        this.clients = {};
        this.logger = logger;

        for (const token of tokens) {
            this.clients[token.provider] = this.createClient(token.provider, token.access_token);
        }
    }

    createClient(provider, access_token) {
        if (provider === 'digitalocean') {
            return new DO_Client(access_token);
        }
    }

    async createServer(provider, region) {
        console.log('Configuring VPN...');
        this.logger('Configuring VPN...');

        const vpnData = await this.clients[provider].createServer(region, this.logger);

        await RNNetworkExtension.configure({
            ipAddress: vpnData.ipAddress,
            domain: vpnData.domain,
            username: vpnData.username,
            password: vpnData.password,
        });

        return vpnData.server;
    }

    async getRegions(provider) {
        return await this.clients[provider].getRegions();
    }

    async getServers() {
        let servers = [];

        for (const client of Object.values(this.clients)) {
            const _servers = await client.getServers();
            servers = [...servers, ..._servers];
        }

        return servers;
    }

    async deleteServer(server) {
        await this.clients[server.provider.id].deleteServer(server);
    }
}

export default Client;
