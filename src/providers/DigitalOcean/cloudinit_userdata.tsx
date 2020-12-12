export default (key: string): string => {
    return `#cloud-config
ssh_authorized_keys:
  - ${key}
write_files:
  - path: /etc/ssh/sshd_config
    permissions: 0600
    owner: root:root
    content: |
      # Use most defaults for sshd configuration.
      UsePrivilegeSeparation sandbox
      Subsystem sftp internal-sftp
      PermitRootLogin no
      AllowUsers core
      PasswordAuthentication no
      ChallengeResponseAuthentication no
  - path: /var/lib/iptables/rules-save
    permissions: 0644
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
      -A INPUT -p tcp --dport 2222 -m state --state NEW -m recent --set --name SSH
      -A INPUT -p tcp --dport 2222 -m state --state NEW -m recent --update --seconds 60 --hitcount 20 --rttl --name SSH -j DROP
      -A INPUT -p tcp --dport 2222 -m state --state NEW -j ACCEPT
      -A INPUT -p udp -m multiport --dports 500,4500 -j ACCEPT
      -A INPUT -p tcp --destination-port 443 -j REJECT --reject-with tcp-reset
      -A INPUT -p udp --destination-port 80 -j REJECT --reject-with icmp-port-unreachable
      -A INPUT -p udp --destination-port 443 -j REJECT --reject-with icmp-port-unreachable
      -A INPUT -d 1.1.1.2 -p udp -j ACCEPT
      -A INPUT -d 1.1.1.2 -p tcp -j ACCEPT
      -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
      -A FORWARD -m conntrack --ctstate NEW -s 192.168.99.0/24 -m policy --pol ipsec --dir in -j ACCEPT
      COMMIT
  - path: /var/lib/ip6tables/rules-save
    permissions: 0644
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
      -A INPUT -p tcp --dport 2222 -m state --state NEW -m recent --set --name SSH
      -A INPUT -p tcp --dport 2222 -m state --state NEW -m recent --update --seconds 60 --hitcount 20 --rttl --name SSH -j DROP
      -A INPUT -p tcp --dport 2222 -m state --state NEW -j ACCEPT
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
coreos:
  update:
    reboot-strategy: reboot
  locksmith:
    window-start: 10:00
    window-length: 1h
  units:
    - name: sshd.socket
      command: restart
      content: |
        [Socket]
        ListenStream=2222
        Accept=yes
        FreeBind=true
    - name: iptables-restore.service
      enable: true
      command: start
    - name: ip6tables-restore.service
      enable: true
      command: start
    - name: dummy-interface.service
      command: start
      enable: true
      content: |
        [Unit]
        Description=Creates a dummy local interface

        [Service]
        User=root
        Type=oneshot
        ExecStartPre=/bin/sh -c "modprobe dummy"
        ExecStartPre=-/bin/sh -c "ip link add dummy0 type dummy"
        ExecStartPre=/bin/sh -c "ip link set dummy0 up"
        ExecStartPre=-/bin/sh -c "ifconfig dummy0 inet6 add fd9d:bc11:4020::/48"
        ExecStartPre=-/bin/sh -c "ifconfig dummy0 1.1.1.2/32"
        ExecStartPre=-/bin/sh -c "ifconfig dummy0 inet6 add fd9d:bc11:4020::/48"
        ExecStartPre=-/bin/sh -c "ifconfig dummy0 1.1.1.2/32"
        ExecStart=/bin/sh -c "echo"
    - name: certificate.service
      enable: true
      command: start
      content: |
        [Unit]
        Description=Create SSL Certificates with Caddy

        [Service]
        User=core
        Type=oneshot
        ExecStartPre=/bin/sh -c '/usr/bin/echo "$public_ipv4" > /home/core/ipv4_address'
        ExecStartPre=/bin/sh -c '/usr/bin/echo $(/usr/bin/cat /home/core/ipv4_address | tr "." "-")".zudvpn.com" > /home/core/domain'
        ExecStartPre=/bin/sh -c '/usr/bin/echo $(/usr/bin/cat /home/core/domain) > /home/core/Caddyfile'
        ExecStartPre=/bin/sh -c '/usr/bin/echo tls core@$(/usr/bin/cat /home/core/domain) >> /home/core/Caddyfile'
        ExecStartPre=/bin/sh -c '/usr/bin/echo /usr/bin/docker run --rm --name caddy -d -v $HOME/Caddyfile:/etc/Caddyfile -v $HOME/.caddy:/root/.caddy -p 80:80 -p 443:443 -e ACME_AGREE=true abiosoft/caddy > /home/core/caddy-docker'
        ExecStartPre=/usr/bin/docker pull abiosoft/caddy:latest
        ExecStart=/usr/bin/bash /home/core/caddy-docker
    - name: prepare-ipsec.service
      enable: true
      command: start
      content: |
        [Unit]
        Description=Copy certificates generated by Caddy
        After=docker.service certificate.service

        [Service]
        User=core
        Type=oneshot
        ExecStartPre=/usr/bin/sleep 30
        ExecStartPre=/bin/sh -c '/usr/bin/sudo chown -R core:core $HOME/.caddy'       
        ExecStartPre=/usr/bin/mkdir -p /home/core/ipsec.d /home/core/ipsec.d/certs /home/core/ipsec.d/private /home/core/ipsec.d/cacerts
        ExecStartPre=/bin/sh -c '/usr/bin/curl -Ss https://letsencrypt.org/certs/letsencryptauthorityx3.pem.txt --output $HOME/ipsec.d/certs/chain.pem'
        ExecStartPre=/bin/sh -c '/usr/bin/cp $(/usr/bin/find $HOME/.caddy -type f -iname "*zudvpn.com.key") $HOME/ipsec.d/private/privkey.pem'
        ExecStartPre=/bin/sh -c '/usr/bin/cp $(/usr/bin/find $HOME/.caddy -type f -iname "*zudvpn.com.crt") $HOME/ipsec.d/certs/cert.pem'
        ExecStartPre=/bin/sh -c '/usr/bin/cat $HOME/ipsec.d/certs/cert.pem $HOME/ipsec.d/certs/chain.pem > $HOME/ipsec.d/certs/fullchain.pem'
        ExecStartPre=/bin/sh -c '/usr/bin/chmod 666 $HOME/ipsec.d/private/privkey.pem'
        ExecStartPre=/bin/sh -c '/usr/bin/chmod 666 $HOME/ipsec.d/certs/fullchain.pem'
        ExecStart=/usr/bin/docker stop caddy
    - name: zudvpn-sysctl.service
      enable: true
      command: start
      content: |
        [Unit]
        Description=Handles settings for sysctl

        [Service]
        Type=oneshot
        User=root
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.ip_forward=1
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.all.forwarding=1
        ExecStartPre=/usr/sbin/sysctl -w net.ipv6.conf.all.forwarding=1
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.all.accept_source_route=0
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.default.accept_source_route=0
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.all.accept_redirects=0
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.default.accept_redirects=0
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.all.secure_redirects=0
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.default.secure_redirects=0
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.icmp_ignore_bogus_error_responses=1
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.all.rp_filter=1
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.default.rp_filter=1
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.all.send_redirects=0
        ExecStartPre=/usr/sbin/sysctl -w net.ipv4.conf.all.send_redirects=0
        ExecStartPre=/usr/bin/echo 1 > /proc/sys/net/ipv4/route/flush
        ExecStartPre=/usr/bin/echo 1 > /proc/sys/net/ipv6/route/flush
        ExecStart=/usr/bin/echo
    - name: strongswan.service
      command: start
      content: |
        [Unit]
        Description=strongswan
        After=docker.service dummy-interface.service prepare-ipsec.service

        [Service]
        User=core
        Restart=always
        TimeoutStartSec=0
        KillMode=none
        EnvironmentFile=/etc/environment
        ExecStartPre=-/usr/bin/docker kill strongswan
        ExecStartPre=-/usr/bin/docker rm strongswan
        ExecStartPre=/usr/bin/docker pull zudvpn/strongswan:0.1.8
        ExecStartPre=/bin/sh -c '/usr/bin/echo /usr/bin/docker run --name strongswan -e VPN_DNS="1.1.1.2" -e DUMMY_DEVICE="1.1.1.2/32" -e VPN_DOMAIN=$(/usr/bin/cat /home/core/domain) --privileged --net=host -v /home/core/ipsec.d:/etc/ipsec.d -v strongswan.d:/etc/strongswan.d -v /lib/modules:/lib/modules -v /etc/localtime:/etc/localtime zudvpn/strongswan:0.1.8 > /home/core/strongswan-docker'
        ExecStart=/usr/bin/bash /home/core/strongswan-docker
        ExecStop=/usr/bin/docker stop strongswan
    - name: pihole-etc-host.service
      command: start
      content: |
        [Unit]
        Description=pihole /etc/hosts entry
        ConditionFirstBoot=true

        [Service]
        User=root
        Type=oneshot
        ExecStart=/bin/sh -c "echo 1.1.1.2         pi.hole >> /etc/hosts"
    - name: pihole.service
      command: start
      content: |
        [Unit]
        Description=pihole
        After=docker.service certificate.service dummy-interface.service

        [Service]
        User=core
        Restart=always
        TimeoutStartSec=0
        KillMode=none
        EnvironmentFile=/etc/environment
        ExecStartPre=-/usr/bin/docker kill pihole
        ExecStartPre=-/usr/bin/docker rm pihole
        ExecStartPre=/usr/bin/docker pull pihole/pihole:latest
        ExecStart=/usr/bin/docker run --name pihole --net=host -e DNS1=1.1.1.1 -e ServerIP=1.1.1.2 -e ServerIPv6=fd9d:bc11:4020:: -e WEBPASSWORD=zudvpn -e WEB_PORT=81 -v pihole-etc:/etc/pihole -v pihole-dnsmasq.d:/etc/dnsmasq.d pihole/pihole:latest
        ExecStop=/usr/bin/docker stop pihole`;
};
