import { ipcRenderer } from 'electron';

/************************************************************************
 *  Event listeners
 ************************************************************************/
ipcRenderer
    .on('manualEvent-res', (event, data) => { 
        console.log("Event 'manualEvent-res' received");
        document.getElementById("container").innerHTML = data;
    })
    .on('autoEvent-res', (event, data) => {
        console.log("Event 'autoEvent-res' received");
        document.getElementById("container").innerHTML = data;
    });

/************************************************************************
 *  Explicit methods
 ************************************************************************/
function sendEventManually() {
    ipcRenderer.send('manualEvent');
    console.log("Event 'manualEvent' sent.");
}

function sendEventOnLoad() {
    ipcRenderer.send('autoEvent');
    console.log("Event 'autoEvent' sent.");
};
sendEventOnLoad();