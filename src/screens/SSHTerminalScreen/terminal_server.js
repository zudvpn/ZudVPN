import NativeStaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

class TerminalServer {
    constructor() {
        if (TerminalServer.instance) {
            return TerminalServer.instance;
        }

        TerminalServer.instance = this;

        this.terminalServer = new NativeStaticServer(0, RNFS.MainBundlePath + '/assets/terminal', { localOnly: true });

        return this;
    }

    async serveTerminal() {
        let url = (await this.terminalServer.isRunning())
            ? this.terminalServer.origin
            : await this.terminalServer.start();

        console.log('URL SERVED', url);

        return url;
    }

    stop() {
        this.terminalServer.stop();
    }
}

export default new TerminalServer();
