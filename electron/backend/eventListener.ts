import {ipcMain, Event} from 'electron';
import * as log from 'electron-log';

export function attachListeners() {
    ipcMain
        .on('manualEvent', (event: Event, data: any) => { 
            log.info("Event 'manualEvent' received");
            event.sender.send("manualEvent-res", "Manual Event Reply");
        })
        .on('autoEvent', (event: Event, data: any) => { 
            log.info("Event 'autoEvent' received");
            event.sender.send("autoEvent-res", "Auto Event Reply");
        });
}