import { Region } from 'providers/types/Region';
import { Notify } from 'store/types/Notify';
import { VPNCredentials } from 'providers/types/VPNCredentials';
import { Server } from 'providers/types/Server';

export interface Client {
    token: string;
    createServer(region: Region, notify: Notify): Promise<VPNCredentials>;
    readServerVPN(server: Server, notify: Notify): Promise<VPNCredentials>;
    getServers(): Promise<Server[]>;
    getRegions(): Promise<Region[]>;
    deleteServer(server: Server): Promise<void>;
}
