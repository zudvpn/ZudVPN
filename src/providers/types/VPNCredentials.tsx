import { Server } from 'providers/types/Server';

export interface VPNCredentials {
    server: Server;
    ipAddress: string;
    domain: string;
    username: string;
    password: string;
}
