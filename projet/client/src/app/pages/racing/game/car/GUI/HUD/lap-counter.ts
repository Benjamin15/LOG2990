import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class LapCounter {

    private lapCounter: Subject<number>;

    public update(turnCounter: number): void {
        this.lapCounter.next(turnCounter);
    }

    public getObservable(): Observable<number> {
        this.lapCounter = new Subject<number>();
        return this.lapCounter.asObservable();
    }
}
