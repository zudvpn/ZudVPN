ZudVPN
==
A mobile application to deploy a personal VPN server in the cloud (DigitalOcean, AWS, GCP, Azure and others) with DNS ad-blocking and other features

Features
--
- Deploys a VPN server to major Cloud Providers (DigitalOcean only, others coming soon).
- Connects to Cloud Providers using OAuth2 or an existing API token.
- Uses IKEv2 IPSec-based VPN service ([strongSwan](https://strongswan.org/)).
- Sets up an ad-blocking DNS resolver ([Pi-hole](https://pi-hole.net/)).
- Installs VPN profile with SSL/TLS certificate (Signed by [Let's Encrypt](https://letsencrypt.org/)).
- Uses native VPN client of iOS (Android version is in development).
- Contains a [xterm.js](https://xtermjs.org/ )-based Terminal for SSH connection to the server (Experimental)


How to install?
--
- The easiest way is to install ZudVPN from App Store or Google Play (soon).
    - Join our Beta Test Program: https://testflight.apple.com/join/o2U4Ljbh
- It is also possible to [build from the source](INSTALL.md).


How to use?
--
- Launch the app and connect to a Cloud Provider using OAuth2 or an existing API token.
- Choose your cloud provider and select a region to start the deployment.
    - It usually takes 3 minutes (on DigitalOcean) to get the VPN server up and running.
    - After the deployment, VPN Profile will be loaded automatically.
- Voila! Start the connection. Now you are behind your personal VPN server. 


FAQ
--
1. Should I use ZudVPN?
    - That's up to you. Use at your own risk.
2. Why is this better than using any free/public/private VPN provider?
    - While most VPN providers will provide a secure connection to their endpoints, you may not be interested in putting blind faith in their claims that they will not log or track your activity online.
    - With ZudVPN, you control all your traffic.
3. How is this different from [trailofbits/algo](https://github.com/trailofbits/algo)?
    - Installation - with a single click of a button you can deploy your own Cloud VPN server on your phone!
4. How much does this cost?
    - ZudVPN tries to use a least priced server on Cloud Providers. For instance, DigitalOcean's least plan costs 5$/month server. Besides, you can always destroy the server whenever you don't need.
5. What is the bandwidth limit?
    - That depends on Cloud Providers. In general, the bandwidths are above 1 TB/month.
6. How does ZudVPN create VPN profiles?
    - On iOS, to create a legitimate VPN profile, iOS requires a valid SSL certificate for the VPN server and a Personal VPN entitlements for the application. ZudVPN generates certificates using [Let's Encrypt](https://letsencrypt.org/) service. To generate certificates Let's Encrypt requires a valid domain. During the deployment, ZudVPN generates a domain name bound to the IP address of your server.
7. How do I SSH into the deployed VPN server?
    - ZudVPN has an incorporated Terminal feature that you can use to log into your server. (Experimental feature)
8. What is the password to login to Pi-hole?
    - The password is `zudvpn`. Access to Pi-hole is restricted to VPN connected users.
9. Are you going to support other Cloud Providers?
    - Yes, we are working to add more providers.
10. Will this make me completely anonymous?
    - No, absolutely not. All of your traffic is going through a provider which could be traced back to your account. You can still be tracked by browser fingerprinting, etc. Your IP address may still leak due to WebRTC, Flash, etc.
11. How do I uninstall VPN profiles?
    - You can destroy VPN server from within the application. This will automatically delete the VPN profile from your phone as well. However, if you delete the profile manually from iOS VPN settings, the server would still be active. You must destroy the server in order to not get charged by the provider.

Troubleshoot
--
- VPN service failures
    - Occasionally obtaining SSL certificate from Let's Encrypt may fail. The easiest way to resolve the issue is to destroy and re-create the server.

Todo
--
- Finish work on Android version
- Work on tvOS version
- Add AWS, GCP and other cloud providers
- Keychain/Keystore shared VPN
- Add WireGuard as a VPN solution

Donate
--
All donations support continued development of ZudVPN.
- We accept donations via [Patreon](https://www.patreon.com/miniyarov).

Powered by
--
- [strongSwan](https://strongswan.org/) - IPSec-based VPN software.
- [CoreOS](http://coreos.com/) - used for running containers.
- [Pi-hole](https://pi-hole.net/) - used for DNS ad-blocking.
- [React-Native](https://reactnative.dev/) - ZudVPN is written using React-Native.

Acknowledgements
--
- [dan-v/dosxvpn](https://github.com/dan-v/dosxvpn) - ZudVPN was mostly inspired by this project.
- [trailofbits/algo](https://github.com/trailofbits/algo) - strongSwan configuration is borrowed from this project.

Building from source
--
- Follow [install steps](INSTALL.md) to build the application locally.
- For iOS: You must have an Apple Developer account because this application uses paid-developer only entitlement Personal VPN.
 