REINSTALL GUIDE
---
The world of mobile application development changes frequently.
To keep up-to-date, applications must continuously update their dependent packages.
The easiest way, we believe, is to periodically reinstall ZudVPN from scratch.
Installing from scratch means create a new react-native project and install every dependent package individually.

1. Let's begin by creating a new react-native project.
    ```
    npx react-native init ZudVPN
    // for tvOS, init with template
    npx react-native init ZudVPN --template=react-native-tvos@latest
    ```
2. ZudVPN is written in TypeScript to ensure type safety. Copy the following `tsconfig.json` to root folder.
    ```json
    {
      "compilerOptions": {
        "allowJs": true,
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true,
        "isolatedModules": true,
        "jsx": "react",
        "lib": ["esnext"],
        "moduleResolution": "node",
        "noEmit": true,
        "strict": true,
        "target": "esnext",
        "baseUrl": ".",
        "paths": {
          "*": ["src/*"],
          "tests": ["tests/*"]
        },
        "skipLibCheck": true,
      },
      "exclude": [
        "node_modules",
        "babel.config.js",
        "metro.config.js",
        "jest.config.js"
      ]
    }
    ```
3. Create `jest.config.js` file to configure Jest to use TypeScript.
    ```javascript
    module.exports = {
      preset: 'react-native',
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
    };
    ```
4. Add Typescript dependencies using `yarn`.
    ```
    yarn add -D typescript @types/jest @types/react @types/react-native @types/react-test-renderer
    ```
5. Copy `index.js` and `src` file and folders.
6. Install `react-native-navigation` by following instructions at [https://wix.github.io/react-native-navigation/docs/installing](https://wix.github.io/react-native-navigation/docs/installing)
    ```
    yarn add react-native-navigation
    ```
7. Install required packages
    ```   
    yarn add react-sweet-state                      # handles stateful components, avoids redux action repetitiveness 
    yarn add react-native-logs                      # a simple, performance-aware logger for app logs

    yarn add react-native-vector-icons              # provides collections of icons
    yarn add react-native-elements                  # provides custom UI elements

    yarn add react-native-fs                        # creates local files for app logs, html for oauth
    yarn add react-native-static-server             # starts static server to redirect Oauth2 callback to app linking (`zudvpn://`) domain
    yarn add react-native-safari-view               # displays web page using native safari browser

    yarn add react-native-network-extension         # interacts with ios network api

    yarn add react-native-ssh-sftp                  # connects to VPN server using SSH protocol
    yarn add uuid react-native-get-random-values    # generates uuid using crypto random values polyfill
    yarn add react-native-rsa-native node-forge     # generates ssh keys (pub/priv)
    yarn add react-native-keychain                  # stores server credentials securely


    yarn add react-native-webview                   # renders terminal as a webpage
    yarn add xterm xterm-addon-fit                  # a fully-featured terminal
    ```
8. Run the following to enable installed libraries for iOS
    ```
    npx pod-install
    ```
