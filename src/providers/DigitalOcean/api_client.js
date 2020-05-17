'use strict';

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

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.indexOf('application/json') !== -1) {
            return await response.json();
        }

        return await response.text();
    }

    async getAccount() {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/account');

        console.log('get account:', response);

        return response.account.email;
    }

    async getAccountSSHKeys() {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/account/keys');

        console.log('get ssh keys:', response);

        return response.ssh_keys.map(ssh_key => ssh_key.id);
    }

    async createSSHKey(name, publicKey) {
        let response = await this.makeRequest(
            'POST',
            'https://api.digitalocean.com/v2/account/keys',
            JSON.stringify({
                name,
                public_key: publicKey,
            }),
        );

        console.log('create ssh keys:', response);

        return response.ssh_key.id;
    }

    async getDropletsByTag(tag) {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/droplets?tag_name=' + tag);

        console.log('get droplets by tag', tag, response);

        return response.droplets;
    }

    async getDropletById(dropletId) {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/droplets/' + dropletId);

        console.log('wait for droplet ip:', response);

        return response.droplet;
    }

    async createDroplet(sshKeys, name, region, size, data, image, tags) {
        let response = await this.makeRequest(
            'POST',
            'https://api.digitalocean.com/v2/droplets',
            JSON.stringify({
                name,
                region,
                size,
                image,
                ssh_keys: sshKeys,
                backups: false,
                private_networking: false,
                monitoring: false,
                ipv6: true,
                user_data: data,
                volumes: null,
                tags: tags,
            }),
        );

        console.log('create droplet:', response);

        return response.droplet;
    }

    async deleteDroplet(dropletId) {
        await this.makeRequest('DELETE', `https://api.digitalocean.com/v2/droplets/${dropletId}`);
    }

    async deleteDomain(domain) {
        await this.makeRequest('DELETE', `https://api.digitalocean.com/v2/domains/${domain}`);
    }

    async getRegions() {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/regions');

        console.log('retrieved all regions', response);

        return response.regions.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
    }

    async getAllFirewalls() {
        let response = await this.makeRequest('GET', 'https://api.digitalocean.com/v2/firewalls');

        console.log('retrieved all firewalls:', response);

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

        console.log('added droplet to firewall');
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

        console.log('create firewall:', response);

        return response.firewall.id;
    }
}

export default ApiClient;
