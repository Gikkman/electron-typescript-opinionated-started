import {DocumentElement} from "./DocumentElement";
import {warn, info} from '@shared/Log'

export class Router {
    routes: Record<string, DocumentElement> = {}
    currentShown: DocumentElement | undefined;

    constructor(){}

    addRoute(path: string, element: DocumentElement, makeDefault = false) {
        this.routes[path] = element;
        if(makeDefault) this.resolveRoute(path);
    }

    resolveRoute(path: string) {
        let nextShown = this.routes[path];
        if(!nextShown) 
            warn("Unknow route " + path);
        else if(nextShown === this.currentShown) 
            info('Already on route ' + path);
        else {
            if(this.currentShown) this.currentShown.hide();
            nextShown.show();
            this.currentShown = nextShown; 
        } 
    }
}