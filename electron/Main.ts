import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { format } from 'url';

import { info } from '@shared/Log';
import { dataDir, resourcesDir } from '@shared/Location';
import { isDev} from '@shared/IsDev';

info('IsDev: ' + isDev)
info('DataDir: ' + dataDir);
info('ResourceDir: ' + resourcesDir);

/************************************************************************
 *  Main behaviour
 ************************************************************************/
import { attachListeners } from './backend/EventListener';
function createWindow() {
    attachListeners();
    let window = new BrowserWindow({
        width: 800, height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.loadURL(format({
        pathname: join(__dirname, './frontend/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    window.webContents.openDevTools()
}

app.on('ready', createWindow);

process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));