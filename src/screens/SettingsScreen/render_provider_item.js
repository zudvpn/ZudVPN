import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { PROVIDER_REGION_SCREEN } from '../screen_constants';
import { useStore } from '../../store/store';
import useScreen from '../screen_hooks';

export const RenderProviderItem = ({ item, componentId }) => {
    const [{ provider_tokens }] = useStore();
    const { ProviderRegisterOverlay } = useScreen();

    const regionScreen = provider => {
        Navigation.push(componentId, {
            component: {
                name: PROVIDER_REGION_SCREEN,
                options: {
                    topBar: {
                        title: {
                            text: 'Regions',
                        },
                        leftButtons: [],
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
        });
    };

    const getAccount = provider => {
        const token = provider_tokens.filter(token => token.provider === provider.id);

        if (token.length > 0) {
            return `connected as ${token[0].account}`;
        }

        return false;
    };

    const onPress = provider => {
        const token = provider_tokens.filter(token => token.provider === provider.id);

        if (token.length > 0) {
            regionScreen(provider);
        } else {
            ProviderRegisterOverlay(provider);
        }
    };

    if (item.available) {
        return (
            <ListItem
                onPress={() => onPress(item)}
                title={item.name}
                subtitle={getAccount(item)}
                subtitleStyle={{ opacity: 0.7 }}
                bottomDivider
                chevron
            />
        );
    }

    return (
        <ListItem
            titleStyle={styles.disabled}
            title={item.name}
            rightTitle={'coming soon'}
            rightTitleStyle={{ opacity: 0.3, fontSize: 12 }}
            bottomDivider
        />
    );
};

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.7,
    },
});
