import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
export class RacePosition {

    private racePosition: Subject<number>;

    public update(racingPosition: number): void {
        this.racePosition.next(racingPosition);
    }
    public getObservable(): Observable<number> {
        this.racePosition = new Subject<number>();
        return this.racePosition.asObservable();
    }
}
