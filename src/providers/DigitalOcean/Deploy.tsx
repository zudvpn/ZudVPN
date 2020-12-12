'use strict';

import SSHClient from './../../ssh/client';
import CloudInitUserData from './cloudinit_userdata';
import { sleep } from '../../helper';
import Keygen, { Keypair } from './../../ssh/keygen';
import logger from '../../logger';
import Keychain from '../../keychain';
import 'react-native-get-random-values';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import ApiClient from 'providers/DigitalOcean/ApiClient';
import { Notify } from 'store/types/Notify';
import { VPNCredentials } from 'providers/types/VPNCredentials';
import { Server } from 'providers/types/Server';

const DROPLET_BASE_NAME = 'zudvpn';
const DROPLET_IMAGE = 'coreos-stable';
const DROPLET_SIZE = 's-1vcpu-1gb';

class Deploy {
    client: ApiClient;
    notify: Notify;

    constructor(client: ApiClient, notify: Notify) {
        this.client = client;
        this.notify = notify;
    }

    async run(region: string): Promise<VPNCredentials> {
        this.notify('progress', 'Creating a server');
        const name = this.generateName(region);
        const sshKeyPair = await this.getSSHKeyPair(name);
        let userData = CloudInitUserData(sshKeyPair.authorizedKey);

        logger.debug(['[DigitalOcean] Generated user data: ', userData]);
        let droplet = await this.client.createDroplet(
            sshKeyPair.fingerprint,
            name,
            region,
            DROPLET_SIZE,
            userData,
            DROPLET_IMAGE,
            DROPLET_BASE_NAME,
        );

        await this.addFirewallToDroplet(DROPLET_BASE_NAME, droplet.id);

        let ipAddress = await this.getIpAddress(droplet);

        const server = {
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
            ipv4Address: ipAddress,
        };

        return await this.read(server, sshKeyPair);
    }

    async read(server: Server, sshKeyPair: Keypair): Promise<VPNCredentials> {
        let sshClient = new SSHClient(sshKeyPair, 'core', server.ipv4Address, 2222);
        await this.waitForSSHConnection(sshClient);

        await this.waitForVPNService(sshClient);

        this.notify('progress', 'Loading VPN authentication credentials');
        let [domain, password] = await Promise.all([
            sshClient.run('/usr/bin/cat /home/core/domain'),
            sshClient.run('docker exec strongswan /bin/sh -c "cat /etc/ipsec.d/client.password"'),
        ]);

        domain = domain.replace(/[\n\r]+/g, '');
        password = password.replace(/[\n\r]+/g, '');

        sshClient.closeSession();

        return {
            server,
            ipAddress: server.ipv4Address,
            domain,
            username: 'vpn',
            password,
        };
    }

    private async getSSHKeyPair(name: string): Promise<Keypair> {
        const sshKeyPair = await Keygen.generateKeyPair();
        logger.debug('[DigitalOcean] SSH Keypair:', sshKeyPair);

        await this.client.createSSHKey(name, sshKeyPair.authorizedKey);

        // Save SSH by droplet key (used to ssh terminal connect)
        Keychain.setSSHKeyPair(name, sshKeyPair);

        return sshKeyPair;
    }

    private async addFirewallToDroplet(droplet_name: string, dropletId: string): Promise<void> {
        this.notify('progress', 'Creating a firewall');

        const firewallName = droplet_name + '-firewall';

        const firewalls = await this.client.getAllFirewalls();

        if (firewalls && firewalls.length > 0) {
            const firewall = firewalls.find((f: any) => f.name === firewallName);

            if (firewall) {
                await this.client.addDropletToFirewall(firewall.id, dropletId);
            }
        } else {
            await this.client.createFirewall(firewallName, dropletId);
        }
    }

    private async waitForVPNService(sshClient: SSHClient): Promise<void> {
        this.notify('progress', 'Waiting for VPN service');

        let countWaitingForVPN = 10;
        do {
            countWaitingForVPN--;
            try {
                await sshClient.run('docker logs strongswan --until=5s &>/dev/null');
                countWaitingForVPN = 0;
            } catch (e) {
                logger.debug(`Attempt ${10 - countWaitingForVPN}/10 failed, reason: ${JSON.stringify(e)}`);

                if (countWaitingForVPN === 0) {
                    throw e;
                }
                await sleep(countWaitingForVPN * 1000);
            }
        } while (countWaitingForVPN > 0);
    }

    private async waitForSSHConnection(sshClient: SSHClient): Promise<void> {
        this.notify('progress', 'Connecting to server');

        let trialLeft = 10;
        do {
            trialLeft--;
            try {
                await sshClient.openSession();
                trialLeft = 0;
            } catch (e) {
                logger.debug(
                    `[DigitalOcean] SSH connection not ready: ${JSON.stringify(e)}, retrying ${10 - trialLeft}/10`,
                );

                await sleep(trialLeft * 1000);
            }
        } while (trialLeft > 0);
    }

    private async getIpAddress(droplet: any): Promise<string> {
        this.notify('progress', 'Waiting for server IP address');

        for (let i = 1; i < 10; i++) {
            for (const ip of droplet.networks.v4) {
                if (ip.ip_address) {
                    this.notify('progress', 'VPN IP address: ' + ip.ip_address);

                    return ip.ip_address;
                }
            }

            await sleep(i * 1000);

            droplet = await this.client.getDropletById(droplet.id);
        }

        throw new Error('Timed out waiting for server provisioning.');
    }

    private generateName = (region: string) => `${DROPLET_BASE_NAME}-${region}-${uuidv4().slice(-4)}`;
}

export default Deploy;
