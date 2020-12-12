import { Token } from 'providers/types/Token';

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parse_linking_url_token(url: string): Token | null {
    let params = url
        .split('?')[1]
        .split('&')
        .reduce(function (result: any, item: string) {
            let parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

    if (Object.keys(params).length > 0 && params.hasOwnProperty('access_token')) {
        return {
            accessToken: params.access_token,
            provider: params.provider,
            account: null,
        };
    }

    return null;
}
