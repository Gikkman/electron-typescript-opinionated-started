import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { format } from 'url';
import * as log from 'electron-log';



/************************************************************************
 *  Log
 ************************************************************************/
let logLocation = process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR : app.getPath("home");
log.transports.file.level = 'info';
log.transports.file.file = join(logLocation, 'electron-log.log');
log.transports.console.level = 'silly';
log.info("Starting node " + process.version);

/************************************************************************
 *  Main behaviour
 ************************************************************************/
import { attachListeners } from './backend/EventListener';
attachListeners();

function createWindow() {
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