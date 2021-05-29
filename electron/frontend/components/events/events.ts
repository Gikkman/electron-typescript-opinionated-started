import { ipcRenderer } from 'electron';
import { DocumentElement } from '../../DocumentElement';
import { readFileSync } from 'original-fs';
import { join } from "path";
import { Event } from '@shared/Event';

export class Events extends DocumentElement {
    constructor(target: HTMLElement) {
        super(target, readFileSync( join(__dirname, "events.html"), 'utf8'));
        const lists = this.findChildByClass('button-list');
        for(const list of lists) {
            for(const button of list.getElementsByTagName("button")) {
                if(button.classList.contains("manual-event"))
                    button.addEventListener("click", () => sendEventManually());
                if(button.classList.contains("list-events"))
                    button.addEventListener("click", () => sendList());
            }
        }

        ipcRenderer
            .on('manualEvent-res', (event, data) => {
                renderSent('manualEvent-res', data);
            })
            .on('autoEvent-res', (event, data) => {
                renderSent('autoEvent-res', data);
            })
            .on('listEvent-res', (event, data : Event[]) => {
                console.log("Event 'listEvent-res' received");
                let list = document.getElementById("list");
                if(list === null) throw "Found no id:list"

                list.innerHTML = "";
                data.forEach(event => {
                    if(list === null) throw "Found no id:list"

                    let elem = document.createElement("li");
                    elem.innerText = event.id + ": " + event.content + " (" + event.created + ")";
                    list.appendChild(elem);
                });
            })
        sendEventOnLoad();
    }
}

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

function renderSent(event: string, data: any) {
    console.log(`Event '${event}' received`);
    const div = document.getElementById("container");
    if(div === null) throw "Found no id:list"
    div.innerHTML = data;
}