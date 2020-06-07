import { Navigation } from 'react-native-navigation';
import registerScreens from './screens/screens';
import { MAIN_SCREEN } from './screens/screen_constants';
import { BACKGROUND_PRIMARY } from './theme';

export default function app() {
    registerScreens();

    Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setDefaultOptions({
            statusBar: {
                style: 'dark',
            },
            topBar: {
                background: {
                    color: BACKGROUND_PRIMARY,
                },
            },
        });

        Navigation.setRoot({
            root: {
                component: {
                    name: MAIN_SCREEN,
                    options: {
                        statusBar: {
                            backgroundColor: BACKGROUND_PRIMARY,
                            style: 'dark',
                        },
                    },
                },
            },
        });
    });
}
