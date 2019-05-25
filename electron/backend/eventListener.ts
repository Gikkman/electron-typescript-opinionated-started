import {ipcMain, Event} from 'electron';

export function attachListeners() {
    ipcMain
        .on('manualEvent', (event: Event, data: any) => { 
            console.log("Event 'manualEvent' received");
            event.sender.send("manualEvent-res", "Manual Event Reply");
        })
        .on('autoEvent', (event: Event, data: any) => { 
            console.log("Event 'autoEvent' received");
            event.sender.send("autoEvent-res", "Auto Event Reply");
        });
}