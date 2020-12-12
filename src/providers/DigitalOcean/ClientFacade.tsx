'use strict';

import { SERVER_TAG } from './constants';
import Deploy from './Deploy';
import ApiClient from './ApiClient';
import Keychain from '../../keychain';
import { Client } from 'providers/types/Client';
import { Region } from 'providers/types/Region';
import { Notify } from 'store/types/Notify';
import { Server } from 'providers/types/Server';
import { VPNCredentials } from 'providers/types/VPNCredentials';

class ClientFacade implements Client {
    token: string;
    apiClient: ApiClient;

    constructor(token: string) {
        this.token = token;

        this.apiClient = new ApiClient(token);
    }

    async getAccount() {
        return await this.apiClient.getAccount();
    }

    async createServer(region: Region, notify: Notify): Promise<VPNCredentials> {
        const deploy = new Deploy(this.apiClient, notify);

        return await deploy.run(region.slug);
    }

    async readServerVPN(server: Server, notify: Notify): Promise<VPNCredentials> {
        const deploy = new Deploy(this.apiClient, notify);

        const sshKeyPair = await Keychain.getSSHKeyPair(server.name);

        return await deploy.read(server, sshKeyPair);
    }

    async getServers(): Promise<Server[]> {
        let droplets = await this.apiClient.getDropletsByTag(SERVER_TAG);

        return droplets.map(
            (droplet: any): Server => {
                return {
                    provider: {
                        id: 'digitalocean',
                        name: 'DigitalOcean',
                    },
                    uid: droplet.id,
                    name: droplet.name,
                    region: {
                        name: droplet.region.name,
                        slug: droplet.region.slug,
                        available: droplet.region.available,
                    },
                    ipv4Address: droplet.networks.v4[0].ip_address,
                };
            },
        );
    }

    async deleteServer(server: Server): Promise<void> {
        await this.apiClient.deleteDroplet(server.uid);
    }

    async getRegions(): Promise<Region[]> {
        let regions = await this.apiClient.getRegions();

        return regions.map(
            (region: any): Region => {
                return {
                    name: region.name,
                    slug: region.slug,
                    available: region.available,
                };
            },
        );
    }
}

export default ClientFacade;
