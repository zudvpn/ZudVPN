export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function ip2domain(ipv4_address) {
    return ipv4_address.split('.').join('-') + '.zudvpn.com';
}

export function parse_linking_url_params(url) {
    console.log('Parsing linking url callback ', url);
    let params = url
        .split('?')[1]
        .split('&')
        .reduce(function(result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

    if (Object.keys(params).length > 0 && params.hasOwnProperty('access_token')) {
        return params;
    }

    return null;
}
