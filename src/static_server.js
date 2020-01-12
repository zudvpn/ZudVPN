import NativeStaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

class StaticServer {
    constructor() {
        if (StaticServer.instance) {
            return StaticServer.instance;
        }

        StaticServer.instance = this;

        this.staticServer = new NativeStaticServer(8080, RNFS.DocumentDirectoryPath + '/config', { localOnly: true });

        return this;
    }

    async serveHtml(html) {
        await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/config', { NSURLIsExcludedFromBackupKey: true });
        const path = RNFS.DocumentDirectoryPath + '/config/callback.html';

        await RNFS.writeFile(path, html, 'utf8');

        let url = (await this.staticServer.isRunning()) ? this.staticServer.origin : await this.staticServer.start();

        return url + '/callback.html';
    }

    stop() {
        this.staticServer.stop();
    }
}

export default new StaticServer();
