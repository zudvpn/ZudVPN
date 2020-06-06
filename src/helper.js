export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function parse_linking_url_params(url) {
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
