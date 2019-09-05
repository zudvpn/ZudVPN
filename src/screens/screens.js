import { Navigation } from 'react-native-navigation'

import WelcomeScreen from './WelcomeScreen'
import ProviderSelectScreen from './ProviderSelectScreen';

export const WELCOME_SCREEN = 'navigation.welcome_screen'
export const PROVIDER_SELECT_SCREEN = 'navigation.provider_select_screen'

export default function registerScreens() {
    Navigation.registerComponent(WELCOME_SCREEN, () => WelcomeScreen)
    Navigation.registerComponent(PROVIDER_SELECT_SCREEN, () => ProviderSelectScreen)
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