import { Navigation } from 'react-native-navigation';

import MainScreen from './MainScreen';
import ProviderRegisterScreen from './ProviderRegisterScreen';
import LogFileViewerScreen from '../LogFileViewerScreen';
import SettingsScreen from './SettingsScreen';
import SSHTerminalScreen from './SSHTerminalScreen';

import AddServerOverlay from './SettingsScreen/add_server_overlay';

export const MAIN_SCREEN = 'navigation.main_screen';
export const PROVIDER_REGISTER_SCREEN = 'navigation.provider_register_screen';
export const LOG_FILE_VIEWER_SCREEN = 'navigation.log_file_viewer_screen';
export const SETTINGS_SCREEN = 'navigation.settings_screen';
export const SSH_TERMINAL_SCREEN = 'navigation.ssh_terminal_screen';

export const ADD_SERVER_OVERLAY = 'navigation.add_server_overlay';

export default function registerScreens() {
    Navigation.registerComponent(MAIN_SCREEN, () => MainScreen);
    Navigation.registerComponent(PROVIDER_REGISTER_SCREEN, () => ProviderRegisterScreen);
    Navigation.registerComponent(LOG_FILE_VIEWER_SCREEN, () => LogFileViewerScreen);
    Navigation.registerComponent(SETTINGS_SCREEN, () => SettingsScreen);
    Navigation.registerComponent(SSH_TERMINAL_SCREEN, () => SSHTerminalScreen);
    Navigation.registerComponent(ADD_SERVER_OVERLAY, () => AddServerOverlay);
}
