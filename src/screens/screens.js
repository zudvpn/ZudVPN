import { Navigation } from 'react-native-navigation'

import WelcomeScreen from './WelcomeScreen'
import ProviderSelectScreen from './ProviderSelectScreen';
import LogFileViewerScreen from '../LogFileViewerScreen';

export const WELCOME_SCREEN = 'navigation.welcome_screen'
export const PROVIDER_SELECT_SCREEN = 'navigation.provider_select_screen'
export const LOG_FILE_VIEWER_SCREEN = 'navigation.log_file_viewer_screen'

export default function registerScreens() {
    Navigation.registerComponent(WELCOME_SCREEN, () => WelcomeScreen)
    Navigation.registerComponent(PROVIDER_SELECT_SCREEN, () => ProviderSelectScreen)
    Navigation.registerComponent(LOG_FILE_VIEWER_SCREEN, () => LogFileViewerScreen)
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