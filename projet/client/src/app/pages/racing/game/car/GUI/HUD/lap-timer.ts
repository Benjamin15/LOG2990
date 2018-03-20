import { Timer } from './../../../../../../../../../commun/services/Timer';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class LapTimer {

    private raceLapTimer: Subject<string>;
    private timer: Timer;
    private raceSaveLapTimes: Array<Subject<string>>;

    public launch(): void {
        this.timer = new Timer();
        this.timer.startTimer();
    }
    public update(): void {
        this.raceLapTimer.next(this.timer.getDate(this.timer.getTimeEllapsed()));
    }

    public getObservable(): Observable<string> {
        this.raceLapTimer = new Subject<string>();
        return this.raceLapTimer.asObservable();
    }

    public getSavedLapTimesObservable(): Array<Observable<string>> {
        this.raceSaveLapTimes = new Array<Subject<string>>();
        for (let i = 0 ; i < 3 ; i++) {
            this.raceSaveLapTimes.push(new Subject<string>());
        }
        return this.raceSaveLapTimes;
    }

    public getTimer(): Timer {
        return this.timer;
    }

    public saveLapTime(turnCounter: number): void {
        this.raceSaveLapTimes[turnCounter - 2].next(this.timer.getDate(this.timer.getTimeEllapsed()));
    }
}
