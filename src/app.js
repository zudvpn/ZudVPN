import { Navigation } from 'react-native-navigation';
import registerScreens, { MAIN_SCREEN } from './screens/screens';

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
