export default (key: string): string => {
    return `#cloud-config
runcmd:
  - sudo sh -c 'echo "1.1.1.2  pi.hole" >> /etc/hosts'
  - sudo sh -c 'modprobe dummy'
  - sudo sh -c 'ip link set dummy0 up'
write_files:
  - path: /etc/rc.local
    permissions: "0755"
    owner: root:root
    content: |
      #!/bin/bash

      # Configuration for SSL Certificates with Caddy
      mkdir -p /home/rancher/.caddy
      echo "$(wget -qO- http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address)" > /home/rancher/ipv4_address
      echo "$(cat /home/rancher/ipv4_address | tr "." "-").zudvpn.com" > /home/rancher/domain
      cat /home/rancher/domain > /home/rancher/Caddyfile
      echo "tls rancher@$(cat /home/rancher/domain)" >> /home/rancher/Caddyfile
      mkdir -p /home/rancher/ipsec.d/certs /home/rancher/ipsec.d/private /home/rancher/ipsec.d/cacerts

      wait-for-docker

      echo 'docker run --rm radial/busyboxplus:curl curl $@' > /home/rancher/curl && chmod +x /home/rancher/curl
      /home/rancher/curl -Ss https://letsencrypt.org/certs/letsencryptauthorityx3.pem.txt > /home/rancher/ipsec.d/certs/chain.pem

      docker pull abiosoft/caddy:latest
      docker run --rm --name caddy -d -v /home/rancher/Caddyfile:/etc/Caddyfile -v /home/rancher/.caddy:/root/.caddy -p 80:80 -p 443:443 -e ACME_AGREE=true abiosoft/caddy

      sleep 30
      cp $(find /home/rancher/.caddy -type f -iname "*zudvpn.com.key") /home/rancher/ipsec.d/private/privkey.pem
      cp $(find /home/rancher/.caddy -type f -iname "*zudvpn.com.crt") /home/rancher/ipsec.d/certs/cert.pem
      cat /home/rancher/ipsec.d/certs/cert.pem /home/rancher/ipsec.d/certs/chain.pem > /home/rancher/ipsec.d/certs/fullchain.pem
      chmod 666 /home/rancher/ipsec.d/private/privkey.pem
      chmod 666 /home/rancher/ipsec.d/certs/fullchain.pem
      docker stop caddy

      docker pull zudvpn/strongswan:0.1.8
      docker run --name strongswan -d -e VPN_DNS="1.1.1.2" -e DUMMY_DEVICE="1.1.1.2/32" -e VPN_DOMAIN=$(cat /home/rancher/domain) --privileged --net=host -v /home/rancher/ipsec.d:/etc/ipsec.d -v strongswan.d:/etc/strongswan.d -v /lib/modules:/lib/modules -v /etc/localtime:/etc/localtime zudvpn/strongswan:0.1.8

      docker pull pihole/pihole:latest
      docker run --name pihole -d --net=host -e DNS1=1.1.1.1 -e ServerIP=1.1.1.2 -e ServerIPv6=fd9d:bc11:4020:: -e WEBPASSWORD=zudvpn -e WEB_PORT=81 -v pihole-etc:/etc/pihole -v pihole-dnsmasq.d:/etc/dnsmasq.d pihole/pihole:latest
ssh_authorized_keys:
  - ${key}
rancher:
  #disable:
  #  - password
  #  - autologin
  ssh:
    port: 22
  network:
    interfaces:
      dummy0:
        addresses:
          - 1.1.1.2/32
          - fd9d:bc11:4020::/48
  sysctl:
    net.ipv4.ip_forward: 1
    net.ipv4.conf.all.forwarding: 1
    net.ipv6.conf.all.forwarding: 1
    net.ipv4.conf.all.accept_source_route: 0
    net.ipv4.conf.default.accept_source_route: 0
    net.ipv4.conf.all.accept_redirects: 0
    net.ipv4.conf.default.accept_redirects: 0
    net.ipv4.conf.all.secure_redirects: 0
    net.ipv4.conf.default.secure_redirects: 0
    net.ipv4.icmp_ignore_bogus_error_responses: 1
    net.ipv4.conf.all.rp_filter: 1
    net.ipv4.conf.default.rp_filter: 1
    net.ipv4.conf.all.send_redirects: 0
    net.ipv4.conf.all.send_redirects: 0
`;
};
