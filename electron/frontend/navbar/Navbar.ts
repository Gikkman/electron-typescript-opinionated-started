import { readFileSync } from 'original-fs';
import {DocumentElement} from '../DocumentElement';
import {Router} from '../Router';
import { join } from "path";

export class Navbar extends DocumentElement {
    constructor(target: HTMLElement, router: Router) {
        super(target, readFileSync( join(__dirname, "navbar.html"), 'utf8'));

        for(const elem of this.findChildByTag('a')) {
            elem.addEventListener('click', function(ev) {
                ev.preventDefault();
                let link = this.getAttribute('href');
                if(!link) throw "No href attribute on the a tag" 
                router.resolveRoute(link);
            });
        }
    }
}