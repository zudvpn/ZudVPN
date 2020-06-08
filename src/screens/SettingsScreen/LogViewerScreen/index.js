import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import RNFS from 'react-native-fs';
import { APPLICATION_LOG_FILENAME } from '../../../logger';
import { Navigation } from 'react-native-navigation';
import { BACKGROUND_PRIMARY, COLOR_SECONDARY } from '../../../theme';

const LogFileViewerScreen = props => {
    const [logs, setLogs] = useState(null);
    const logFile = RNFS.DocumentDirectoryPath + '/' + APPLICATION_LOG_FILENAME + '.txt';

    Navigation.events().registerNavigationButtonPressedListener(({ buttonId, componentId }) => {
        if (componentId === props.componentId && buttonId === 'clear_log') {
            Alert.alert('Warning!', 'Are you sure you want to clear application logs?', [
                {
                    text: 'Clear',
                    onPress: () => clearLogs(),
                    style: 'destructive',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]);
        }
    });

    const clearLogs = () => {
        RNFS.writeFile(logFile, '').then(() => {
            setLogs('');
        });
    };

    useEffect(() => {
        const read_log_file = async () => {
            try {
                setLogs(await RNFS.readFile(logFile));
            } catch (e) {
                setLogs('');
            }
        };

        read_log_file();
    }, []);

    if (logs === null) {
        return (
            <SafeAreaView
                style={{
                    backgroundColor: BACKGROUND_PRIMARY,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator size={'large'} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_PRIMARY }}>
            <ScrollView style={{ flex: 1 }}>
                <TextInput editable={false} multiline={true} style={{ color: COLOR_SECONDARY }} selectable={true}>
                    {logs}
                </TextInput>
            </ScrollView>
        </SafeAreaView>
    );
};

export default LogFileViewerScreen;
