export type CreateElementConfig = {
    id: string|null;
    className: string|null,
}

export class Document {
    static createElement(name: string, config: CreateElementConfig|null = null): HTMLElement {
        const element = document.createElement(name);

        if(!config) {
            return element;
        }

        if(config.id) {
            element.id = config.id;
        }
        
        if(config.className) {
            element.className = config.className;
        }

        return element;
    }
}