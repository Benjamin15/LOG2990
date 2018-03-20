import { Timer } from './../../../../../../../../../commun/services/Timer';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class TotalTimer {

    private raceTimer: Subject<string>;
    private timer: Timer;

    public launch(): void {
        this.timer = new Timer();
        this.timer.startTimer();
    }

    public update(): void {
        this.raceTimer.next(this.timer.getDate(this.timer.getTimeEllapsed()));
    }

    public getObservable(): Observable<string> {
        this.raceTimer = new Subject<string>();
        return this.raceTimer.asObservable();
    }

    public getTimer(): Timer {
        return this.timer;
    }
}

