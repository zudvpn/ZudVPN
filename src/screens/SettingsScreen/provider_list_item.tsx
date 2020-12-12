import React from 'react';
// import { StyleSheet } from 'react-native';
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

        return null;
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
        const account = getAccount(item);

        return (
            <ListItem
                containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }}
                bottomDivider
                onPress={() => onPress(item)}>
                <ListItem.Content>
                    <ListItem.Title style={{ color: COLOR_SECONDARY }}>{item.name}</ListItem.Title>
                    {account && (
                        <ListItem.Subtitle style={{ opacity: 0.7, color: COLOR_SECONDARY }}>
                            {account}
                        </ListItem.Subtitle>
                    )}
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        );
    }

    return <></>;

    // return (
    //     <ListItem containerStyle={{ backgroundColor: BACKGROUND_SECONDARY }} bottomDivider>
    //         <ListItem.Content>
    //             <ListItem.Title style={[styles.disabled, { color: COLOR_SECONDARY }]}>{item.name}</ListItem.Title>
    //         </ListItem.Content>
    //         <ListItem.Content right>
    //             <ListItem.Title right style={{ opacity: 0.3, fontSize: 12, color: COLOR_SECONDARY }}>
    //                 {'coming soon'}
    //             </ListItem.Title>
    //         </ListItem.Content>
    //     </ListItem>
    // );
};

// const styles = StyleSheet.create({
//     disabled: {
//         opacity: 0.7,
//     },
// });
