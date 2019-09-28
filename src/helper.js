export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function ip2domain(ipv4_address) {
    return ipv4_address.split('.').join('-') + '.zudvpn.com'
}