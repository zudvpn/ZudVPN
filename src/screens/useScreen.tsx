import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import {
    LOG_FILE_VIEWER_SCREEN,
    PROVIDER_REGION_SCREEN,
    PROVIDER_REGISTER_SCREEN,
    SETTINGS_SCREEN,
    SSH_TERMINAL_SCREEN,
} from './constants';
import { Provider } from 'providers/types/Provider';

const useScreen = () => {
    return {
        ProviderRegisterScreenPush: (props: { componentId: string; provider: Provider }) =>
            Navigation.push(props.componentId, {
                component: {
                    name: PROVIDER_REGISTER_SCREEN,
                    options: {
                        topBar: {
                            title: {
                                text: props.provider.name,
                            },
                        },
                    },
                    passProps: props,
                },
            }),
        ProviderRegionScreenPush: (componentId: string, provider: Provider) =>
            Navigation.push(componentId, {
                component: {
                    name: PROVIDER_REGION_SCREEN,
                    options: {
                        topBar: {
                            title: {
                                text: 'Regions',
                            },
                            rightButtons: [
                                {
                                    id: 'sign_out',
                                    text: 'Sign out',
                                    color: 'red',
                                },
                            ],
                        },
                    },
                    passProps: {
                        provider,
                    },
                },
            }),
        LogFileViewerScreenPush: (componentId: string) =>
            Navigation.push(componentId, {
                component: {
                    name: LOG_FILE_VIEWER_SCREEN,
                    options: {
                        topBar: {
                            title: {
                                text: 'Log Viewer',
                            },
                            rightButtons: [
                                {
                                    id: 'clear_log',
                                    text: 'Clear',
                                    color: 'red',
                                },
                            ],
                        },
                    },
                },
            }),
        SettingsScreenModal: () =>
            Navigation.showModal({
                stack: {
                    children: [
                        {
                            component: {
                                name: SETTINGS_SCREEN,
                                options: {
                                    modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
                                    statusBar: {
                                        style: 'dark',
                                        backgroundColor: 'red',
                                    },
                                    topBar: {
                                        title: {
                                            text: 'Settings',
                                        },
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
        SSHTerminalScreenModal: (name: string, ipv4Address: string) =>
            Navigation.showModal({
                stack: {
                    children: [
                        {
                            component: {
                                name: SSH_TERMINAL_SCREEN,
                                options: {
                                    topBar: {
                                        title: {
                                            text: 'Terminal',
                                        },
                                        rightButtons: [
                                            {
                                                id: 'cancel',
                                                text: 'Cancel',
                                            },
                                        ],
                                    },
                                },
                                passProps: {
                                    name,
                                    ipv4Address,
                                },
                            },
                        },
                    ],
                },
            }),
    };
};

export default useScreen;
