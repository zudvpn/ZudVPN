import { Navigation } from 'react-native-navigation'

import WelcomeScreen from './WelcomeScreen'
import ProviderSelectScreen from './ProviderSelectScreen';
import LogFileViewerScreen from '../LogFileViewerScreen';
import ServerSelectScreen from './ServerSelectScreen';

export const WELCOME_SCREEN = 'navigation.welcome_screen'
export const PROVIDER_SELECT_SCREEN = 'navigation.provider_select_screen'
export const LOG_FILE_VIEWER_SCREEN = 'navigation.log_file_viewer_screen'
export const SERVER_SELECT_SCREEN = 'navigation.server_select_screen'

export default function registerScreens() {
    Navigation.registerComponent(WELCOME_SCREEN, () => WelcomeScreen)
    Navigation.registerComponent(PROVIDER_SELECT_SCREEN, () => ProviderSelectScreen)
    Navigation.registerComponent(LOG_FILE_VIEWER_SCREEN, () => LogFileViewerScreen)
    Navigation.registerComponent(SERVER_SELECT_SCREEN, () => ServerSelectScreen)
}

export const ProviderSelectScreenModal = (staticServer) => Navigation.showModal({
    stack: {
        children: [
            {
                component: {
                    name: PROVIDER_SELECT_SCREEN,
                    passProps: {
                        staticServer
                    }
                }
            }
        ]
    }
})

export const LogFileViewerScreenModal = () => Navigation.showModal({
    stack: {
        children: [
            {
                component: {
                    name: LOG_FILE_VIEWER_SCREEN
                }
            }
        ]
    }
})

export const ServerSelectScreenModel = (access_token) => Navigation.showModal({
    stack: {
        children: [
            {
                component: {
                    name: SERVER_SELECT_SCREEN,
                    passProps: {
                        access_token
                    }
                }
            }
        ]
    }
})