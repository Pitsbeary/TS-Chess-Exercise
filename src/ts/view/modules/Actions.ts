export enum ActionEnum {
    ACTION_TOGGLE_CLASS = 'toggle-class'
}

export type ActionsOptions = {
    selector: string,
}

export class Actions {
    constructor(private readonly options: ActionsOptions) 
    {
        this.options = options;
    }

    public init() 
    {
        const buttons = document.querySelectorAll(this.options.selector);

        for(const button of buttons) {
            this.initButton(button as HTMLElement);
        }
    }

    public initButton(button: HTMLElement) 
    {
        button.addEventListener('click', (e) => {
            this.onButtonClick(button);
        })
    }

    public onButtonClick(button: HTMLElement) {
        const actionType = button.dataset.action;

        switch(actionType) {
            case ActionEnum.ACTION_TOGGLE_CLASS:
                this.toggleClass(button);
                break;
            default:
                break;
        }
    }

    public toggleClass(button: HTMLElement) {
        if(!button.dataset.selector) {
            return;
        }

        if(!button.dataset.classname) {
            return;
        }

        const elements = document.querySelectorAll(button.dataset.selector);

        elements.forEach((element) => {
            element.classList.toggle(button.dataset.classname!);
        })
    }
}