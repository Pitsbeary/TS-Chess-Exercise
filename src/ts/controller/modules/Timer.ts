export class Timer {
    private interval: NodeJS.Timeout | null = null;
    public timestamp: number = 0;

    constructor(private callback: (timer: Timer) => any)
    {
        this.callback = callback;
    }

    startTimer()
    {
        this.timestamp = new Date().getTime();

        setInterval(() => {
            this.callback(this);
        });
    }

    stopTimer()
    {
        if(!this.interval) {
            return;
        }

        clearInterval(this.interval);
    }
}