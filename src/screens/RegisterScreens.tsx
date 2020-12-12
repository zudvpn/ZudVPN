import { Navigation } from 'react-native-navigation';

import MainScreen from './MainScreen';
import ProviderRegisterScreen from './ProviderRegisterScreen';
import LogFileViewerScreen from './SettingsScreen/LogViewerScreen';
import SettingsScreen from './SettingsScreen';
import ProviderRegionScreen from './SettingsScreen/ProviderRegionScreen';
import SSHTerminalScreen from './SSHTerminalScreen';

import {
    LOG_FILE_VIEWER_SCREEN,
    MAIN_SCREEN,
    PROVIDER_REGION_SCREEN,
    PROVIDER_REGISTER_SCREEN,
    SETTINGS_SCREEN,
    SSH_TERMINAL_SCREEN,
} from './constants';

export default function RegisterScreens() {
    Navigation.registerComponent(MAIN_SCREEN, () => MainScreen);
    Navigation.registerComponent(PROVIDER_REGISTER_SCREEN, () => ProviderRegisterScreen);
    Navigation.registerComponent(LOG_FILE_VIEWER_SCREEN, () => LogFileViewerScreen);
    Navigation.registerComponent(SETTINGS_SCREEN, () => SettingsScreen);
    Navigation.registerComponent(PROVIDER_REGION_SCREEN, () => ProviderRegionScreen);
    Navigation.registerComponent(SSH_TERMINAL_SCREEN, () => SSHTerminalScreen);
}
