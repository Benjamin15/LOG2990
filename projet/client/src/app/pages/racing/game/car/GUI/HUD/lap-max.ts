import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class LapMax {

    private lapMax: Subject<number>;

    public update(maxTurn: number): void {
        this.lapMax.next(maxTurn);
    }

    public getObservable(): Observable<number> {
        this.lapMax = new Subject<number>();
        return this.lapMax.asObservable();
    }
}
