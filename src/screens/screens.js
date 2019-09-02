import { Navigation } from 'react-native-navigation'

import WelcomeScreen from './WelcomeScreen'

export const WELCOME_SCREEN = 'navigation.welcome_screen'

export default function registerScreens() {
    Navigation.registerComponent(WELCOME_SCREEN, () => WelcomeScreen)
}