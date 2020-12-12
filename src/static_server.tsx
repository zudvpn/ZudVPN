import NativeStaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

class StaticServer {
    private static instance: StaticServer;
    private staticServer: NativeStaticServer;

    private constructor(staticServer: NativeStaticServer) {
        this.staticServer = staticServer;
    }

    public static getInstance(): StaticServer {
        if (!StaticServer.instance) {
            StaticServer.instance = new StaticServer(
                new NativeStaticServer(8080, RNFS.DocumentDirectoryPath + '/config', { localOnly: true }),
            );
        }

        return StaticServer.instance;
    }

    async serveHtml(html: string) {
        await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/config', { NSURLIsExcludedFromBackupKey: true });
        const path = RNFS.DocumentDirectoryPath + '/config/callback.html';

        await RNFS.writeFile(path, html, 'utf8');

        let url = (await this.staticServer.isRunning()) ? this.staticServer._origin : await this.staticServer.start();

        return url + '/callback.html';
    }

    stop() {
        this.staticServer.stop();
    }
}

export default StaticServer.getInstance();
