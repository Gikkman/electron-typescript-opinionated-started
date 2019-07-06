import { ipcRenderer } from 'electron';
import { Event } from 'shared/Event';

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
    })
    .on('listEvent-res', (event, data : Event[]) => {
        console.log("Event 'listEvent-res' received");
        let list = document.getElementById("list");
        list.innerHTML = "";
        data.forEach(event => {
            let elem = document.createElement("li");
            elem.innerText = event.id + ": " + event.content + " (" + event.created + ")";
            list.appendChild(elem);
        });
    })

/************************************************************************
 *  Explicit methods
 ************************************************************************/
function sendEventManually() {
    ipcRenderer.send('manualEvent', 'hello from manual event');
    console.log("Event 'manualEvent' sent.");
}

function sendList() {
    ipcRenderer.send('listEvent');
    console.log("Event 'listEvent' sent.");
}

function sendEventOnLoad() {
    ipcRenderer.send('autoEvent', 'hello from auto event');
    console.log("Event 'autoEvent' sent.");
};
sendEventOnLoad();