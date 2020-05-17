import { Navigation } from 'react-native-navigation';
import {
    LOG_FILE_VIEWER_SCREEN,
    PROVIDER_REGISTER_SCREEN,
    PROVIDER_REGION_SCREEN,
    SETTINGS_SCREEN,
    SSH_TERMINAL_SCREEN,
} from './screen_constants';

const useScreen = () => {
    return {
        LogFileViewerScreenModal: () =>
            Navigation.showModal({
                stack: {
                    children: [
                        {
                            component: {
                                name: LOG_FILE_VIEWER_SCREEN,
                            },
                        },
                    ],
                },
            }),
        SettingsScreenModel: () =>
            Navigation.showModal({
                stack: {
                    children: [
                        {
                            component: {
                                name: SETTINGS_SCREEN,
                                options: {
                                    topBar: {
                                        title: {
                                            text: 'Settings',
                                        },
                                        leftButtons: [],
                                        rightButtons: [
                                            {
                                                id: 'done_button',
                                                text: 'Done',
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    ],
                },
            }),
        ProviderRegionScreenModal: provider =>
            Navigation.showModal({
                stack: {
                    children: [
                        {
                            component: {
                                name: PROVIDER_REGION_SCREEN,
                                passProps: {
                                    provider,
                                },
                            },
                        },
                    ],
                },
            }),
        SSHTerminalScreenModal: (dropletId, ipv4_address) =>
            Navigation.showModal({
                stack: {
                    children: [
                        {
                            component: {
                                name: SSH_TERMINAL_SCREEN,
                                passProps: {
                                    dropletId,
                                    ipv4_address,
                                },
                            },
                        },
                    ],
                },
            }),
        ProviderRegisterOverlay: provider =>
            Navigation.showOverlay({
                component: {
                    name: PROVIDER_REGISTER_SCREEN,
                    passProps: {
                        provider,
                    },
                    options: {
                        overlay: {
                            interceptTouchOutside: false,
                        },
                    },
                },
            }),
    };
};

export default useScreen;
