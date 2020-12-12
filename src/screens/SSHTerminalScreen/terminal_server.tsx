import NativeStaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

class TerminalServer {
    private static instance: TerminalServer;
    private terminalServer: NativeStaticServer;

    private constructor(terminalServer: NativeStaticServer) {
        this.terminalServer = terminalServer;
    }

    public static getInstance(): TerminalServer {
        if (!TerminalServer.instance) {
            TerminalServer.instance = new TerminalServer(
                new NativeStaticServer(0, RNFS.MainBundlePath + '/assets/terminal', { localOnly: true }),
            );
        }

        return TerminalServer.instance;
    }

    async serveTerminal(): Promise<string> {
        let url = (await this.terminalServer.isRunning())
            ? this.terminalServer._origin
            : await this.terminalServer.start();

        console.log('URL SERVED', url);

        return url as string;
    }

    stop() {
        this.terminalServer.stop();
    }
}

export default TerminalServer.getInstance();
