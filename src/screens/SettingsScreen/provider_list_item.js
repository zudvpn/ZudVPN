import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useStore } from '../../store/store';
import useScreen from '../screen_hooks';
import { BACKGROUND_SECONDARY, COLOR_SECONDARY } from '../../theme';

export const ProviderListItem = ({ item, componentId }) => {
    const [{ provider_tokens }] = useStore();
    const { ProviderRegisterScreenPush, ProviderRegionScreenPush } = useScreen();

    const getAccount = (provider) => {
        const token = provider_tokens.filter((t) => t.provider === provider.id);

        if (token.length > 0) {
            return `connected as ${token[0].account}`;
        }

        return false;
    };

    const onPress = (provider) => {
        const token = provider_tokens.filter((t) => t.provider === provider.id);

        if (token.length > 0) {
            ProviderRegionScreenPush(componentId, provider);
        } else {
            ProviderRegisterScreenPush({ componentId, provider });
        }
    };

    if (item.available) {
        return (
            <ListItem
                containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }}
                onPress={() => onPress(item)}
                title={item.name}
                titleStyle={{ color: COLOR_SECONDARY }}
                subtitle={getAccount(item)}
                subtitleStyle={{ opacity: 0.7, color: COLOR_SECONDARY }}
                bottomDivider
                chevron
            />
        );
    }

    return (
        <ListItem
            containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }}
            titleStyle={[styles.disabled, { color: COLOR_SECONDARY }]}
            title={item.name}
            rightTitle={'coming soon'}
            rightTitleStyle={{ opacity: 0.3, fontSize: 12, color: COLOR_SECONDARY }}
            bottomDivider
        />
    );
};

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.7,
    },
});
