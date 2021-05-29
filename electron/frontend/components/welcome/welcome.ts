import { DocumentElement } from '../../DocumentElement';
import { readFileSync } from 'original-fs';
import { join } from "path";

export class Welcome extends DocumentElement {
    constructor(target: HTMLElement) {
        super(target, readFileSync(join(__dirname, "welcome.html"), 'utf8'));
    }
}