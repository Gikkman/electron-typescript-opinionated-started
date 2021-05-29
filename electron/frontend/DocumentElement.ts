export abstract class DocumentElement {
    protected me: HTMLElement;

    constructor(target: HTMLElement, html: string) {
        this.me = target;
        this.hide();
        this.me.innerHTML = html;
        return this;
    }

    protected findById(id: string) {
        return document.getElementById(id);
    }

    protected findChildByClass(className: string) {
        return this.me.getElementsByClassName(className);
    }

    protected findChildByTag<K extends keyof HTMLElementTagNameMap>(tagName: K) {
        return this.me.getElementsByTagName(tagName);
    }

    show(): this {
        this.me.hidden = false;
        return this;
    }

    hide(): this {
        this.me.hidden = true;
        return this;
    }
}