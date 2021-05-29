import { DocumentElement } from '../DocumentElement';
import { readFileSync } from 'original-fs';
import { join } from "path";

export class Footer extends DocumentElement {
    constructor(target: HTMLElement) {
        super(target, readFileSync( join(__dirname, "footer.html"), 'utf8'));
    }
}