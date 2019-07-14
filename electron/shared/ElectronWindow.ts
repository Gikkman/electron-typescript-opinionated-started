import {BrowserWindow, remote} from 'electron';

let isRenderer = process.type === 'renderer';
let undefinedOrNull = _var => {
return typeof _var === 'undefined' || _var === null;
};

export function getMainWindow() {
    // renderer process
    if (isRenderer) {
      const mainWindow = remote.BrowserWindow.getAllWindows();
  
      if (
        undefinedOrNull(mainWindow) ||
        undefinedOrNull(mainWindow[mainWindow.length - 1])
      ) {
        return null;
      }
  
      return mainWindow[mainWindow.length - 1];
    }
  
    // main process
    const mainWindow = BrowserWindow.getAllWindows();
    if (
      undefinedOrNull(mainWindow) ||
      undefinedOrNull(mainWindow[mainWindow.length - 1])
    ) {
      return null;
    }
  
    return mainWindow[mainWindow.length - 1];
  };