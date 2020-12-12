import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useStore } from '../../store/store';
import useScreen from '../useScreen';
import { BACKGROUND_SECONDARY, COLOR_SECONDARY } from '../../theme';
import { Provider } from 'providers/types/Provider';

interface Props {
    item: { id: string; name: string; available: boolean };
    componentId: string;
}

export const ProviderListItem = ({ item, componentId }: Props) => {
    const [{ providerTokens }] = useStore();
    const { ProviderRegisterScreenPush, ProviderRegionScreenPush } = useScreen();

    const getAccount = (provider: Provider) => {
        const token = providerTokens.filter((t) => t.provider === provider.id);

        if (token.length > 0) {
            return `connected as ${token[0].account?.email}`;
        }

        return <></>;
    };

    const onPress = (provider: Provider) => {
        const token = providerTokens.filter((t) => t.provider === provider.id);

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
