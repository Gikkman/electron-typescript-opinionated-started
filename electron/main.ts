import {app, BrowserWindow} from 'electron';
import {join, resolve} from 'path';
import {format} from 'url';
import * as log from 'electron-log';

import {attachListeners} from './backend/eventListener';
attachListeners();

var appRoot: string = process.env.PORTABLE_EXECUTABLE_DIR ? process.env.PORTABLE_EXECUTABLE_DIR : resolve('./');
var window: BrowserWindow;

/************************************************************************
 *  Log
 ************************************************************************/
log.transports.file.level = 'info';
log.transports.file.file = join(appRoot, 'log.log');
log.transports.console.level = 'silly';
log.info("Starting node " + process.version);
log.info("App started. Root path: " + appRoot);

/************************************************************************
 *  Database startup
 ************************************************************************/
import * as db from './backend/repositories/db';
db.migrate(true);
db.database.exec("SELECT 1");

/************************************************************************
 *  Main behaviour
 ************************************************************************/
function createWindow() { 
  window = new BrowserWindow({width: 800, height: 600, 
    webPreferences: {
      nodeIntegration: true
    }
  });
  window.loadURL(format ({ 
      pathname: join(__dirname, './frontend/index.html'), 
      protocol: 'file:', 
      slashes: true
  }));
  window.webContents.openDevTools()
}

app.on('ready', createWindow);