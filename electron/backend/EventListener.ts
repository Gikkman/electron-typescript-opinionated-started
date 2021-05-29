import { ipcMain, Event } from 'electron';
import * as log from 'electron-log';
import { IpcMainEvent } from 'electron/main';
import { save, all } from './repositories/EventRepository';

export function attachListeners() {
    ipcMain
        .on('manualEvent', (event : IpcMainEvent, data : any) => {
            log.info("Event 'manualEvent' received");
            save(data);
            event.sender.send("manualEvent-res", "Manual Event Reply");
        })
        .on('autoEvent', (event : IpcMainEvent, data : any) => {
            log.info("Event 'autoEvent' received");
            save(data);
            event.sender.send("autoEvent-res", "Auto Event Reply");
        })
        .on('listEvent', (event : IpcMainEvent, data : any) => {
            log.info("Event 'autoEvent' received");
            let list = all();
            event.sender.send("listEvent-res", list);
        });
}