export default (key: string): string => {
    return `#cloud-config
runcmd:
  - sudo bash -c 'echo "1.1.1.2  pi.hole" >> /etc/hosts'
write_files:
  - container: network
    path: /var/lib/iptables/rules-save
    permission: "0755"
    owner: root:root
    content: |
      *mangle
      :PREROUTING ACCEPT [0:0]
      :INPUT ACCEPT [0:0]
      :FORWARD ACCEPT [0:0]
      :OUTPUT ACCEPT [0:0]
      :POSTROUTING ACCEPT [0:0]
      -A FORWARD -s 192.168.99.0/24 -o eth0 -p tcp -m tcp --tcp-flags SYN,RST SYN -m tcpmss --mss 1361:1536 -j TCPMSS --set-mss 1360
      COMMIT
      *nat
      :PREROUTING ACCEPT [0:0]
      :POSTROUTING ACCEPT [0:0]
      -A POSTROUTING -s 192.168.99.0/24 -m policy --pol none --dir out -j MASQUERADE
      COMMIT
      *filter
      :INPUT DROP [0:0]
      :FORWARD DROP [0:0]
      :OUTPUT ACCEPT [0:0]
      -A INPUT -i lo -j ACCEPT
      -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
      -A INPUT -p esp -j ACCEPT
      -A INPUT -p ah -j ACCEPT
      -A INPUT -p ipencap -m policy --dir in --pol ipsec --proto esp -j ACCEPT
      -A INPUT -p icmp --icmp-type echo-request -m hashlimit --hashlimit-upto 5/s --hashlimit-mode srcip --hashlimit-srcmask 32 --hashlimit-name icmp-echo-drop -j ACCEPT
      -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set --name SSH
      -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 20 --rttl --name SSH -j DROP
      -A INPUT -p tcp --dport 22 -m state --state NEW -j ACCEPT
      -A INPUT -p udp -m multiport --dports 500,4500 -j ACCEPT
      -A INPUT -p tcp --destination-port 443 -j REJECT --reject-with tcp-reset
      -A INPUT -p udp --destination-port 80 -j REJECT --reject-with icmp-port-unreachable
      -A INPUT -p udp --destination-port 443 -j REJECT --reject-with icmp-port-unreachable
      -A INPUT -d 1.1.1.2 -p udp -j ACCEPT
      -A INPUT -d 1.1.1.2 -p tcp -j ACCEPT
      -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
      -A FORWARD -m conntrack --ctstate NEW -s 192.168.99.0/24 -m policy --pol ipsec --dir in -j ACCEPT
      COMMIT
  - container: network
    path: /var/lib/ip6tables/rules-save
    permission: "0755"
    owner: root:root
    content: |
      *nat
      :PREROUTING ACCEPT [0:0]
      :POSTROUTING ACCEPT [0:0]
      -A POSTROUTING -s fd9d:bc11:4020::/48 -m policy --pol none --dir out -j MASQUERADE
      COMMIT
      *filter
      :INPUT DROP [0:0]
      :FORWARD DROP [0:0]
      :OUTPUT ACCEPT [0:0]
      :ICMPV6-CHECK - [0:0]
      :ICMPV6-CHECK-LOG - [0:0]
      -A INPUT -i lo -j ACCEPT
      -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
      -A INPUT -p esp -j ACCEPT
      -A INPUT -m ah -j ACCEPT
      -A INPUT -p icmpv6 --icmpv6-type echo-request -m hashlimit --hashlimit-upto 5/s --hashlimit-mode srcip --hashlimit-srcmask 32 --hashlimit-name icmp-echo-drop -j ACCEPT
      -A INPUT -p icmpv6 --icmpv6-type router-advertisement -m hl --hl-eq 255 -j ACCEPT
      -A INPUT -p icmpv6 --icmpv6-type neighbor-solicitation -m hl --hl-eq 255 -j ACCEPT
      -A INPUT -p icmpv6 --icmpv6-type neighbor-advertisement -m hl --hl-eq 255 -j ACCEPT
      -A INPUT -p icmpv6 --icmpv6-type redirect -m hl --hl-eq 255 -j ACCEPT
      -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set --name SSH
      -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 20 --rttl --name SSH -j DROP
      -A INPUT -p tcp --dport 22 -m state --state NEW -j ACCEPT
      -A INPUT -p udp -m multiport --dports 500,4500 -j ACCEPT
      -A INPUT -p tcp --destination-port 443 -j REJECT --reject-with tcp-reset
      -A INPUT -p udp --destination-port 80 -j REJECT --reject-with icmp6-port-unreachable
      -A INPUT -p udp --destination-port 443 -j REJECT --reject-with icmp6-port-unreachable
      -A INPUT -d fd9d:bc11:4020::/48 -p udp -j ACCEPT
      -A INPUT -d fd9d:bc11:4020::/48 -p tcp -j ACCEPT
      -A FORWARD -j ICMPV6-CHECK
      -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
      -A FORWARD -m conntrack --ctstate NEW -s fd9d:bc11:4020::/48 -m policy --pol ipsec --dir in -j ACCEPT
      -A ICMPV6-CHECK -p icmpv6 -m hl ! --hl-eq 255 --icmpv6-type router-solicitation -j ICMPV6-CHECK-LOG
      -A ICMPV6-CHECK -p icmpv6 -m hl ! --hl-eq 255 --icmpv6-type router-advertisement -j ICMPV6-CHECK-LOG
      -A ICMPV6-CHECK -p icmpv6 -m hl ! --hl-eq 255 --icmpv6-type neighbor-solicitation -j ICMPV6-CHECK-LOG
      -A ICMPV6-CHECK -p icmpv6 -m hl ! --hl-eq 255 --icmpv6-type neighbor-advertisement -j ICMPV6-CHECK-LOG
      -A ICMPV6-CHECK-LOG -j LOG --log-prefix "ICMPV6-CHECK-LOG DROP "
      -A ICMPV6-CHECK-LOG -j DROP
      COMMIT
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

      system-docker cp /sbin/iptables-restore network:/sbin/
      system-docker cp /sbin/ip6tables-restore network:/sbin/
      system-docker exec -d network bash -c "iptables-restore --noflush < /var/lib/iptables/rules-save"
      system-docker exec -d network bash -c "ip6tables-restore --noflush < /var/lib/ip6tables/rules-save"

      echo 'docker run --rm radial/busyboxplus:curl curl $@' > /home/rancher/curl && chmod +x /home/rancher/curl
      /home/rancher/curl -Ss https://letsencrypt.org/certs/letsencryptauthorityx3.pem.txt > /home/rancher/ipsec.d/certs/chain.pem

      docker pull abiosoft/caddy:latest
      docker run --rm --name caddy -d -v /home/rancher/Caddyfile:/etc/Caddyfile -v /home/rancher/.caddy:/root/.caddy -p 80:80 -p 443:443 -e ACME_AGREE=true abiosoft/caddy

      sleep 30
      cp $(find /home/rancher/.caddy -type f -iname "*zudvpn.com.key") /home/rancher/ipsec.d/private/privkey.pem
      cp $(find /home/rancher/.caddy -type f -iname "*zudvpn.com.crt") /home/rancher/ipsec.d/certs/cert.pem
      cat /home/rancher/ipsec.d/certs/cert.pem /home/rancher/ipsec.d/certs/chain.pem > /home/rancher/ipsec.d/certs/fullchain.pem
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
      eth0:
        pre_up:
          - modprobe dummy
          - ip link add dummy0 type dummy
          - ip addr add 1.1.1.2/32 dev dummy0
          - ip addr add fd9d:bc11:4020::/48 dev dummy0
          - ip link set dummy0 up
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
