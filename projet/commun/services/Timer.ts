export class Timer {

    private start: number;
    public timer = 0;

    constructor() {
        //this.start = 300;
        this.start = 60;
    }

    public startTimer(): void {
        this.timer = Date.now();
    }

    public getTimer(): number {
        return this.start - Math.floor((Date.now() - this.timer) / 1000);
    }

    public getTimerMiliseconds(): number{
        return this.start - Math.floor((Date.now() - this.timer) );
    }

    public getTimeEllapsed(): number{
        return  Date.now() - this.timer
    }

    public setStart(start: number): void {
        this.start = start;
    }

    public getcountDown(): number {
        return (Date.now() - this.timer) / 1000;
    }

    public getDate(time: number): string {
        //const date = new Date(Date.now() - this.timer);
        const date = new Date(time);
        return this.formatDate(date.getMinutes()) + ':' +
            this.formatDate(date.getSeconds()) + ':' +
            this.formatDate(Math.floor(date.getMilliseconds() / 10));
    }

    private formatDate(time: number): string {
        return  (time < 10) ? '0' + time : time.toString();
    }
}
