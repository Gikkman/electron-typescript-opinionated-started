import {app, BrowserWindow} from 'electron';
import {join, resolve} from 'path';
import {format} from 'url';

import {attachListeners} from './backend/eventListener';
import * as db from './backend/repositories/db';
db.database.exec("SELECT 1");
attachListeners();

var log: (message: string) => void = console.log;
var window: BrowserWindow;

/************************************************************************
 *  Log
 ************************************************************************/
log("Starting node " + process.version);
log("App started. Root path: " + resolve("./"));

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