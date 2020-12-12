'use strict';

import DO_Client from './DigitalOcean/ClientFacade';
// @ts-ignore
import RNNetworkExtension from 'react-native-network-extension';
import logger from '../logger';
import { Token } from 'providers/types/Token';
import { Client as ClientInterface } from 'providers/types/Client';
import { Region } from 'providers/types/Region';
import { Notify } from 'store/types/Notify';
import { Server } from 'providers/types/Server';

class Client {
    clients: Map<string, ClientInterface>;

    constructor(tokens: Array<Token>) {
        this.clients = new Map();

        for (const token of tokens) {
            this.clients.set(token.provider, this.createClient(token));
        }
    }

    createClient(token: Token): ClientInterface {
        if (token.provider === 'digitalocean') {
            return new DO_Client(token.accessToken);
        }

        throw new Error('Token provider is not registered.');
    }

    async createServer(provider: string, region: Region, notify: Notify): Promise<Server> {
        const vpnCredentials = await this.clients.get(provider)?.createServer(region, notify);

        if (!vpnCredentials) {
            throw new Error('Cannot retrieve VPN credentials');
        }

        notify('progress', 'Configuring authentication');
        await RNNetworkExtension.configure({
            ipAddress: vpnCredentials.ipAddress,
            domain: vpnCredentials.domain,
            username: vpnCredentials.username,
            password: vpnCredentials.password,
        });

        return vpnCredentials.server;
    }

    async configureServer(provider: string, server: Server, notify: Notify): Promise<Server> {
        const vpnCredentials = await this.clients.get(provider)?.readServerVPN(server, notify);

        if (!vpnCredentials) {
            throw new Error('Cannot retrieve VPN credentials');
        }

        notify('progress', 'Configuring authentication');
        await RNNetworkExtension.configure({
            ipAddress: vpnCredentials.ipAddress,
            domain: vpnCredentials.domain,
            username: vpnCredentials.username,
            password: vpnCredentials.password,
        });

        return vpnCredentials.server;
    }

    async getRegions(provider: string) {
        try {
            return await this.clients.get(provider)?.getRegions();
        } catch (e) {
            logger.warn([`Cannot load ${provider} regions`, e.message]);
        }

        return [];
    }

    async getServers(): Promise<Server[]> {
        const requests = Array.from(this.clients, ([, client]) => client.getServers().catch((e) => e));

        const responses = await Promise.all(requests);

        return responses
            .filter((response: Server | Error) => {
                if (response instanceof Error) {
                    logger.warn('Retrieving servers failed, reason: ' + response.message);

                    return false;
                }

                return true;
            })
            .flat();
    }

    async deleteServer(server: Server): Promise<void> {
        await this.clients.get(server.provider.id)?.deleteServer(server);
    }
}

export default Client;
