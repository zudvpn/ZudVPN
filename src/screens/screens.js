import { Navigation } from 'react-native-navigation';

import WelcomeScreen from './WelcomeScreen';
import ProviderRegisterScreen from './ProviderRegisterScreen';
import LogFileViewerScreen from '../LogFileViewerScreen';
import ServerSelectScreen from './ServerSelectScreen';
import SSHTerminalScreen from './SSHTerminalScreen';

import AddServerOverlay from './ServerSelectScreen/add_server_overlay';

export const WELCOME_SCREEN = 'navigation.welcome_screen';
export const PROVIDER_REGISTER_SCREEN = 'navigation.provider_register_screen';
export const LOG_FILE_VIEWER_SCREEN = 'navigation.log_file_viewer_screen';
export const SERVER_SELECT_SCREEN = 'navigation.server_select_screen';
export const SSH_TERMINAL_SCREEN = 'navigation.ssh_terminal_screen';

export const ADD_SERVER_OVERLAY = 'navigation.add_server_overlay';

export default function registerScreens() {
    Navigation.registerComponent(WELCOME_SCREEN, () => WelcomeScreen);
    Navigation.registerComponent(PROVIDER_REGISTER_SCREEN, () => ProviderRegisterScreen);
    Navigation.registerComponent(LOG_FILE_VIEWER_SCREEN, () => LogFileViewerScreen);
    Navigation.registerComponent(SERVER_SELECT_SCREEN, () => ServerSelectScreen);
    Navigation.registerComponent(SSH_TERMINAL_SCREEN, () => SSHTerminalScreen);
    Navigation.registerComponent(ADD_SERVER_OVERLAY, () => AddServerOverlay);
}
