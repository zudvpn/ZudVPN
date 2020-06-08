import { Navigation } from 'react-native-navigation';
import registerScreens from './screens/screens';
import { MAIN_SCREEN } from './screens/screen_constants';
import { BACKGROUND_SECONDARY, COLOR_SECONDARY } from './theme';

export default function app() {
    registerScreens();

    Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setDefaultOptions({
            topBar: {
                title: {
                    color: COLOR_SECONDARY,
                },
                background: {
                    color: BACKGROUND_SECONDARY,
                },
            },
        });

        Navigation.setRoot({
            root: {
                component: {
                    name: MAIN_SCREEN,
                },
            },
        });
    });
}
