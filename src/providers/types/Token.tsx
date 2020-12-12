import { Account } from 'providers/types/Account';

export interface Token {
    provider: string;
    accessToken: string;
    account?: Account | null;
}
