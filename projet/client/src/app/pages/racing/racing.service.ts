import { Time } from './../../../../../commun/models/Time';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const FIVE_BEST_TIMES = 4;

@Injectable()
export class RacingService {

    constructor(private http: Http) {
    }

    public async sendAverage(name: string, appreciation: number): Promise<boolean> {
        const url = 'http://localhost:3000/piste/appreciation/' + name + '/' + appreciation;
        return this.http.get(url).toPromise().then(() => {
            return true;
        });
    }

    public sortCircuitBestTimes(bestTimesArray: Array<Time>): void {
        bestTimesArray.sort((previousTime: Time, nextTime: Time) => {
            if (previousTime.time < nextTime.time) {
                return - 1;
            } else if (previousTime.time > nextTime.time) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    public insertNewBestTime(bestTimes: Time[][], newPlayerTime: Time, raceCount: number): Array<Array<Time>> {
        raceCount--;
        if (bestTimes[raceCount] === null) {
            bestTimes[raceCount] = new Array<Time>();
        }
        bestTimes[raceCount].push(newPlayerTime);
        this.sortCircuitBestTimes(bestTimes[raceCount]);
        bestTimes[raceCount].splice(FIVE_BEST_TIMES + 1, bestTimes[raceCount].length - FIVE_BEST_TIMES);
        return bestTimes;
    }

    public async sendCircuitBestTimes(name: string, bestTimes: Array<Array<Time>>): Promise<boolean> {
        const circuitBestTimes = JSON.stringify(bestTimes);
        const url = 'http://localhost:3000/piste/bestTimes/' + name + '/' + circuitBestTimes;
        return this.http.get(url).toPromise().then(() => {
            return true;
        });
    }
}

