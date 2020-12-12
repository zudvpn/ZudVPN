import { Navigation } from 'react-native-navigation';
import RegisterScreens from './screens/RegisterScreens';
import { MAIN_SCREEN } from './screens/constants';
import { BACKGROUND_SECONDARY, COLOR_SECONDARY } from './theme';

export default function app() {
    RegisterScreens();

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
