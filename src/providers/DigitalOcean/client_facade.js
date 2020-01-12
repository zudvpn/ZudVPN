'use strict';

import { SERVER_TAG } from './constants';
import { ip2domain } from '../../helper';
import Deploy from './deploy';
import ApiClient from './api_client';

class ClientFacade {
    constructor(token) {
        this.token = token;

        this.api_client = new ApiClient(token);
    }

    async createServer(region, logger) {
        const deploy = Deploy({
            client: this.api_client,
            token: this.token,
            region: region.slug,
            setLog: logger,
        });
        return await deploy.run();
    }

    async getServers() {
        let droplets = await this.api_client.getDropletsByTag(SERVER_TAG);

        console.log('get droplets by tag', SERVER_TAG, droplets);

        return droplets.map(droplet => {
            return {
                provider: 'digitalocean',
                uid: droplet.id,
                name: droplet.name,
                region: {
                    name: droplet.region.name,
                    slug: droplet.region.slug,
                },
                ipv4_address: droplet.networks.v4[0].ip_address,
            };
        });
    }

    deleteServer(server) {
        Promise.all([
            this.api_client.deleteDroplet(server.uid),
            this.api_client.deleteDomain(ip2domain(server.ipv4_address)),
        ]);
    }

    async getRegions() {
        return await this.api_client.getRegions();
    }
}

export default ClientFacade;
