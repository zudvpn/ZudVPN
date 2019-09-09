import { Navigation } from 'react-native-navigation'
import registerScreens, {
    WELCOME_SCREEN,
    ProviderSelectScreenModal,
    LogFileViewerScreenModal,
    ServerSelectScreenModel
} from './screens/screens'


export default function app() {
    registerScreens()

    Navigation.events().registerAppLaunchedListener(() => {
        Navigation.setRoot({
            root: {
                component: {
                    name: WELCOME_SCREEN,
                    passProps: {
                        ProviderSelectScreenModal,
                        LogFileViewerScreenModal,
                        ServerSelectScreenModel
                    }
                }
            }
        })
    })
}

