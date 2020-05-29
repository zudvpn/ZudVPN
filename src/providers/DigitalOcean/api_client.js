'use strict';

import ProviderAuthenticationError from '../../exceptions/ProviderAuthenticationError';
import ProviderInvalidContentError from '../../exceptions/ProviderInvalidContentError';
import ProviderUnexpectedError from '../../exceptions/ProviderUnexpectedError';

class ApiClient {
    constructor(token) {
        this.token = token;
    }

    async makeRequest(method, url, body = null) {
        let response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.token,
            },
            body,
        });

        console.log(`[DigitalOcean API] url: ${url}, response: `, response);

        if (!response.hasOwnProperty('headers')) {
            throw new ProviderInvalidContentError('DigitalOcean API returned an invalid response.');
        }

        let content;
        if (
            response.headers.get('content-type') &&
            response.headers.get('content-type').indexOf('application/json') !== -1
        ) {
            content = await response.json();
        } else {
            content = await response.text();
        }

        if (response.status > 399) {
            const message = content.hasOwnProperty('message') ? content.message : JSON.stringify(content);

            if (response.status === 401) {
                throw new ProviderAuthenticationError(message);
            }

            throw new ProviderUnexpectedError(message);
        }

        return content;
    }

    async getAccount() {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/account');

        return response.account.email;
    }

    async createSSHKey(name, public_key) {
        let response = await this.makeRequest(
            'POST',
            'https://api.digitalocean.com/v2/account/keys',
            JSON.stringify({
                name,
                public_key,
            }),
        );

        return response.ssh_key.id;
    }

    async getDropletsByTag(tag) {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/droplets?tag_name=' + tag);

        return response.droplets;
    }

    async getDropletById(dropletId) {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/droplets/' + dropletId);

        return response.droplet;
    }

    async createDroplet(ssh_fingerprint, name, region, size, user_data, image, tag) {
        let response = await this.makeRequest(
            'POST',
            'https://api.digitalocean.com/v2/droplets',
            JSON.stringify({
                name,
                region,
                size,
                image,
                ssh_keys: [ssh_fingerprint],
                user_data,
                tags: [tag],
                backups: false,
                private_networking: false,
                monitoring: false,
                ipv6: true,
                volumes: null,
            }),
        );

        return response.droplet;
    }

    async deleteDroplet(dropletId) {
        await this.makeRequest('DELETE', `https://api.digitalocean.com/v2/droplets/${dropletId}`);
    }

    async getRegions() {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/regions');

        return response.regions.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
    }

    async getAllFirewalls() {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/firewalls');

        return response.firewalls;
    }

    async addDropletToFirewall(firewallId, dropletId) {
        await this.makeRequest(
            'POST',
            `https://api.digitalocean.com/v2/firewalls/${firewallId}/droplets`,
            JSON.stringify({
                droplet_ids: [dropletId],
            }),
        );
    }

    async createFirewall(name, dropletId) {
        let response = await this.makeRequest(
            'POST',
            'https://api.digitalocean.com/v2/firewalls',
            JSON.stringify({
                name,
                inbound_rules: [
                    {
                        protocol: 'icmp',
                        sources: {
                            addresses: ['0.0.0.0/0', '::/0'],
                        },
                    },
                    {
                        protocol: 'tcp',
                        ports: '80',
                        sources: {
                            addresses: ['0.0.0.0/0', '::/0'],
                        },
                    },
                    {
                        protocol: 'tcp',
                        ports: '443',
                        sources: {
                            addresses: ['0.0.0.0/0', '::/0'],
                        },
                    },
                    {
                        protocol: 'tcp',
                        ports: '2222',
                        sources: {
                            addresses: ['0.0.0.0/0', '::/0'],
                        },
                    },
                    {
                        protocol: 'udp',
                        ports: '500',
                        sources: {
                            addresses: ['0.0.0.0/0', '::/0'],
                        },
                    },
                    {
                        protocol: 'udp',
                        ports: '4500',
                        sources: {
                            addresses: ['0.0.0.0/0', '::/0'],
                        },
                    },
                ],
                outbound_rules: [
                    {
                        protocol: 'icmp',
                        destinations: {
                            addresses: ['0.0.0.0/0', '::/0'],
                        },
                    },
                    {
                        protocol: 'tcp',
                        ports: 'all',
                        destinations: {
                            addresses: ['0.0.0.0/0', '::/0'],
                        },
                    },
                    {
                        protocol: 'udp',
                        ports: 'all',
                        destinations: {
                            addresses: ['0.0.0.0/0', '::/0'],
                        },
                    },
                ],
                droplet_ids: [dropletId],
            }),
        );

        return response.firewall.id;
    }
}

export default ApiClient;
