import { Router } from './Router';
import { Navbar } from './navbar/Navbar';
import { Footer } from './footer/Footer';
import { Welcome } from './components/welcome/welcome';
import { Events } from './components/events/Events';

import { ipcRenderer } from 'electron';

/************************************************************************
 *  Explicit methods
 ************************************************************************/
const nav = document.getElementById("top-navbar") as HTMLElement;
const main = document.getElementById("top-content") as HTMLElement;
const foot = document.getElementById("top-footer") as HTMLElement;

let router = new Router();
new Navbar(newDiv(nav), router).show();

router.addRoute('welcome', new Welcome(newDiv(main)).show(), true);
router.addRoute('events', new Events(newDiv(main)));

new Footer(newDiv(foot)).show();


function docReady(fn: Function) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", () => fn());
    }
}

function newDiv(parent: HTMLElement) {
    const elem = document.createElement('div');
    parent.append(elem);
    return elem;
}

docReady( () => {
    ipcRenderer.send("ready");
});