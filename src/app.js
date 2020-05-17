import { Navigation } from 'react-native-navigation';
import registerScreens from './screens/screens';
import { MAIN_SCREEN } from './screens/screen_constants';

export default function app() {
    registerScreens();

    Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setRoot({
            root: {
                component: {
                    name: MAIN_SCREEN,
                },
            },
        });
    });
}
