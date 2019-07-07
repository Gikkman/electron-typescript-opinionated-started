import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { format } from 'url';

/************************************************************************
 *  Main behaviour
 ************************************************************************/
function createWindow() {
    const { attachListeners } = require('./backend/EventListener');
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