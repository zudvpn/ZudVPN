import { Provider } from 'providers/types/Provider';
import { Region } from 'providers/types/Region';

export interface Server {
    uid: string;
    provider: Provider;
    name: string;
    region: Region;
    ipv4Address: string;
}
