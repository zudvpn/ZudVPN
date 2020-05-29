import { logger } from 'react-native-logs';
import { rnFsFileAsync } from 'react-native-logs/dist/transports/rnFsFileAsync';
import { colorConsoleAfterInteractions } from 'react-native-logs/dist/transports/colorConsoleAfterInteractions';

export const APPLICATION_LOG_FILENAME = 'application_logs';

let transport = (msg, level, options) => {
    if (__DEV__) {
        colorConsoleAfterInteractions(msg, level, options);
    }
    rnFsFileAsync(msg, level, options);
};

const config = {
    levels: {
        debug: 0,
        info: 1,
        progress: 2,
        success: 3,
        warn: 4,
        error: 5,
    },
    transport,
    transportOptions: {
        dateFormat: 'utc',
        loggerName: APPLICATION_LOG_FILENAME,
    },
};

const log = logger.createLogger(config);

if (!__DEV__) {
    log.setSeverity('info');
}

export default log;
