'use strict';

import ProviderAuthenticationError from '../../exceptions/ProviderAuthenticationError';
import ProviderInvalidContentError from '../../exceptions/ProviderInvalidContentError';
import ProviderUnexpectedError from '../../exceptions/ProviderUnexpectedError';
import { Account } from 'providers/types/Account';

class ApiClient {
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    async makeRequest(method: string, url: string, body: null | string = null) {
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

        let content: any = await response.text();
        console.log('[DigitalOcean API] content: ', content);
        if (response.headers.get('content-type')?.includes('application/json')) {
            content = JSON.parse(content);
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

    async getAccount(): Promise<Account> {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/account');

        return { email: response.account.email };
    }

    async createSSHKey(name: string, public_key: string): Promise<string> {
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

    async getDropletsByTag(tag: string) {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/droplets?tag_name=' + tag);

        return response.droplets;
    }

    async getDropletById(dropletId: string) {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/droplets/' + dropletId);

        return response.droplet;
    }

    async createDroplet(
        ssh_fingerprint: string,
        name: string,
        region: string,
        size: string,
        user_data: string,
        image: string,
        tag: string,
    ) {
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

    async deleteDroplet(dropletId: string): Promise<void> {
        await this.makeRequest('DELETE', `https://api.digitalocean.com/v2/droplets/${dropletId}`);
    }

    async deleteSshKey(fingerprint: string): Promise<void> {
        await this.makeRequest('DELETE', `https://api.digitalocean.com/v2/account/keys/${fingerprint}`);
    }

    async getRegions() {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/regions');

        return response.regions.sort((a: any, b: any) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
    }

    async getAllFirewalls() {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/firewalls');

        return response.firewalls;
    }

    async addDropletToFirewall(firewallId: string, dropletId: string) {
        await this.makeRequest(
            'POST',
            `https://api.digitalocean.com/v2/firewalls/${firewallId}/droplets`,
            JSON.stringify({
                droplet_ids: [dropletId],
            }),
        );
    }

    async createFirewall(name: string, dropletId: string) {
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
                        ports: '22',
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
