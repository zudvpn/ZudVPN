'use strict';

import SSHClient from './../../ssh/client';
import CloudInitUserData from './cloudinit_userdata';
import { sleep } from '../../helper';
import Keygen from './../../ssh/keygen';
import logger from '../../logger';
import Keychain from '../../keychain';
import { v4 as uuidv4 } from 'uuid';

const DROPLET_BASE_NAME = 'zudvpn';
const DROPLET_IMAGE = 'coreos-stable';
const DROPLET_SIZE = 's-1vcpu-1gb';

const Deploy = ({ client, notify }) => {
    const generateName = region => {
        return `${DROPLET_BASE_NAME}-${region}-${uuidv4().slice(-12)}`;
    };

    const run = async region => {
        notify('progress', 'Creating a server');
        const name = generateName(region);
        const sshKeyPair = await getSSHKeyPair(name);
        let userData = CloudInitUserData(sshKeyPair.authorizedKey);

        logger.debug(['[DigitalOcean] Generated user data: ', userData]);
        let droplet = await client.createDroplet(
            sshKeyPair.fingerprint,
            name,
            region,
            DROPLET_SIZE,
            userData,
            DROPLET_IMAGE,
            DROPLET_BASE_NAME,
        );

        await addFirewallToDroplet(DROPLET_BASE_NAME, droplet.id);

        let ipAddress = await getIpAddress(droplet);

        const server = {
            uid: droplet.id,
            name: droplet.name,
            region: {
                name: droplet.region.name,
                slug: droplet.region.slug,
            },
        };

        return await read(server, sshKeyPair, ipAddress);
    };

    const read = async (server, sshKeyPair, ipAddress) => {
        let sshClient = new SSHClient(sshKeyPair, 'core', ipAddress, 2222);
        await waitForSSHConnection(sshClient);

        await waitForVPNService(sshClient);

        notify('progress', 'Loading VPN authentication credentials');
        let [domain, password] = await Promise.all([
            sshClient.run('/usr/bin/cat /home/core/domain'),
            sshClient.run('docker exec strongswan /bin/sh -c "cat /etc/ipsec.d/client.password"'),
        ]);

        domain = domain.replace(/[\n\r]+/g, '');
        password = password.replace(/[\n\r]+/g, '');

        sshClient.closeSession();
        sshClient = null;

        return {
            server: {
                provider: 'digitalocean',
                uid: server.uid,
                name: server.name,
                region: {
                    name: server.region.name,
                    slug: server.region.slug,
                },
                ipv4_address: ipAddress,
            },
            ipAddress,
            domain,
            username: 'vpn',
            password,
        };
    };

    const getSSHKeyPair = async name => {
        const sshKeyPair = await Keygen.generateKeyPair();
        logger.debug('[DigitalOcean] SSH Keypair:', sshKeyPair);

        await client.createSSHKey(name, sshKeyPair.authorizedKey);

        // Save SSH by droplet key (used to ssh terminal connect)
        Keychain.setSSHKeyPair(name, sshKeyPair);

        return sshKeyPair;
    };

    const addFirewallToDroplet = async (droplet_name, dropletId) => {
        notify('progress', 'Creating a firewall');

        const firewallName = droplet_name + '-firewall';

        const firewalls = await client.getAllFirewalls();

        if (firewalls && firewalls.length > 0) {
            const firewall = firewalls.find(f => f.name === firewallName);

            if (firewall) {
                await client.addDropletToFirewall(firewall.id, dropletId);
            }
        } else {
            await client.createFirewall(firewallName, dropletId);
        }
    };

    const waitForVPNService = async sshClient => {
        notify('progress', 'Waiting for VPN service');

        let countWaitingForVPN = 10;
        do {
            countWaitingForVPN--;
            try {
                await sshClient.run('docker logs strongswan --until=5s &>/dev/null');
                countWaitingForVPN = 0;
            } catch (e) {
                logger.debug(`Attempt ${10 - countWaitingForVPN}/10 failed, reason: ${e.message || e}`);

                if (countWaitingForVPN === 0) {
                    throw e;
                }
                await sleep(countWaitingForVPN * 1000);
            }
        } while (countWaitingForVPN > 0);
    };

    const waitForSSHConnection = async sshClient => {
        notify('progress', 'Connecting to server');

        let trialLeft = 10;
        do {
            trialLeft--;
            try {
                await sshClient.openSession();
                trialLeft = 0;
            } catch (e) {
                logger.debug(
                    `[DigitalOcean] SSH connection not ready: ${e.message || e}, retrying ${10 - trialLeft}/10`,
                );

                await sleep(trialLeft * 1000);
            }
        } while (trialLeft > 0);
    };

    const getIpAddress = async droplet => {
        notify('progress', 'Waiting for server IP address');

        for (let i = 1; i < 10; i++) {
            for (const ip of droplet.networks.v4) {
                if (ip.ip_address) {
                    notify('progress', 'VPN IP address: ' + ip.ip_address);

                    return ip.ip_address;
                }
            }

            await sleep(i * 1000);

            droplet = await client.getDropletById(droplet.id);
        }

        throw new Error('Timed out waiting for server provisioning.');
    };

    return {
        run,
        read,
    };
};

export default Deploy;
