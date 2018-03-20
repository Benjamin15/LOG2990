import { LapTimer } from './../car/GUI/HUD/lap-timer';
import { TotalTimer } from './../car/GUI/HUD/total-timer';


export class StatisticsIa {

    public totalTurn: number;
    public totalTime: number;
    public totalTimer: TotalTimer;
    public lapTimer: LapTimer;
    public timeTurn: Array<string>;

    constructor(turnNumber: number) {
        this.totalTime = 0;
        this.timeTurn = new Array<string>();
        this.lapTimer = new LapTimer();
        this.totalTimer = new TotalTimer();
        this.totalTurn = turnNumber;
    }

    public update(): void {

    }

    public startTimer(): void {
        this.totalTimer.launch();
        this.lapTimer.launch();
    }

    public TimeEllapsed(): string {
        const time = this.totalTimer.getTimer().getTimeEllapsed();
        return this.totalTimer.getTimer().getDate(time);
    }

    public recordLapTimes(): void {
        const lapTime = this.lapTimer.getTimer().getTimeEllapsed();
        this.lapTimer.launch();
        this.timeTurn.push(this.lapTimer.getTimer().getDate(lapTime));
    }

    public getFinalTime(): string {
        return this.totalTimer.getTimer().getDate(this.totalTime);
    }

    public recordFinalTime(): void {
        this.totalTime = this.totalTimer.getTimer().getTimeEllapsed();
    }

}
