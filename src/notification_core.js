import RNFS from 'react-native-fs';

window.notification_messages = [];

const logFile = RNFS.DocumentDirectoryPath + '/notification_logs.txt';

const log = (...messages) => {
    const message = messages.join(' ');
    write(message);
};

const write = message => {
    window.notification_messages.push(message);
    // RNFS.unlink(logFile)
    // RNFS.appendFile(logFile, message + '\n')
};

const logs = () => {
    return window.notification_messages;
};

const read_log_file = async () => {
    return await RNFS.readFile(logFile);
};

export default {
    log,
    write,
    logs,
    read_log_file,
};
