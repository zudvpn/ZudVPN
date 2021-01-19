ZudVPN uses iOS network API to create a VPN profile. Apple mandates apps to use `Personal VPN` entitlement to interact with VPN profiles.
However, `Personal VPN` entitlement is restricted to registered Apple Developers. As such, you must have a developer account to run ZudVPN on an iOS Device during development.

Prerequisites (Also refer to [React Native Setup](https://reactnative.dev/docs/environment-setup) page)
- Xcode
- Xcode command line tools
- Node
- Yarn

Install
- `yarn install`
- `npx pod-install`
- `npx react-native run-ios`

Limitation on iOS Simulator: Apple does not allow VPN Profile installation on iOS Simulator. Thus, you will be able to create VPN Server and interact with it using in-app terminal, however, you cannot install VPN Profile on iOS Simulator. You must use an iOS Device to fully run this application.
