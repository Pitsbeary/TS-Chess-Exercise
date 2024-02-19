export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;

export type TimerEvent = CustomEvent & {
    detail: TimerEventDetail
};

export type TimerEventDetail = {
    id: string;
}

export type TimerUpdateEvent = TimerEvent & {
    detail: TimerUpdateEventDetail;
}

export type TimerUpdateEventDetail = {
    id: string;
    value: number;
}

export type PlayerTimerOptions = {
    selector: string;
}

export class PlayerTimer {
    constructor(private readonly options: PlayerTimerOptions) 
    {
        this.options = options;
    }

    public init() 
    {
        document.addEventListener('TimerUpdate', (e: Event) => {
            this.onTimerUpdate((e as TimerUpdateEvent).detail);
        });
    }

    public onTimerUpdate(data: TimerUpdateEventDetail)
    {
        if(!data.id || !data.value) {
            return;
        }

        const timerElement = document.querySelector(`${this.options.selector}#${data.id}`);

        if(!timerElement) {
            return;
        }

        timerElement.innerHTML = PlayerTimer.prepareTimeValue(data.value);
    }

    public static prepareTimeValue(value: number)
    {
        let time: number = value;

        const hours = Number.parseInt(Math.floor(time / SECONDS_IN_HOUR).toString());
        time = time - (hours * SECONDS_IN_HOUR);

        const minutes = Number.parseInt(Math.floor(time / SECONDS_IN_MINUTE).toString());
        time = time - (minutes * SECONDS_IN_MINUTE);

        const seconds = Number.parseInt(time.toString());

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}