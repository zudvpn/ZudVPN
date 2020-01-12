import { Navigation } from 'react-native-navigation';
import {
    ADD_SERVER_OVERLAY,
    LOG_FILE_VIEWER_SCREEN,
    PROVIDER_REGISTER_SCREEN,
    SERVER_SELECT_SCREEN,
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
        ServerSelectScreenModel: () =>
            Navigation.showModal({
                stack: {
                    children: [
                        {
                            component: {
                                name: SERVER_SELECT_SCREEN,
                                options: {
                                    topBar: {
                                        title: {
                                            text: 'Servers',
                                        },
                                        leftButtons: [],
                                        rightButtons: [
                                            {
                                                id: 'cancel',
                                                text: 'Cancel',
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
        AddServerOverlayOverlay: access_token =>
            Navigation.showOverlay({
                component: {
                    name: ADD_SERVER_OVERLAY,
                    passProps: {
                        access_token,
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
