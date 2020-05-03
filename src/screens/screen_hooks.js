import { Navigation } from 'react-native-navigation';
import {
    ADD_SERVER_OVERLAY,
    LOG_FILE_VIEWER_SCREEN,
    PROVIDER_REGISTER_SCREEN,
    SETTINGS_SCREEN,
    SSH_TERMINAL_SCREEN,
} from './screens';

const useScreen = () => {
    return {
        ProviderRegisterScreenModal: () =>
            Navigation.showModal({
                stack: {
                    children: [
                        {
                            component: {
                                name: PROVIDER_REGISTER_SCREEN,
                            },
                        },
                    ],
                },
            }),
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
        AddServerOverlayOverlay: () =>
            Navigation.showOverlay({
                component: {
                    name: ADD_SERVER_OVERLAY,
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
