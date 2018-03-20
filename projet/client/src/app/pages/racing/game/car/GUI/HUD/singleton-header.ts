import { RacePosition } from './race-position';
import { LapMax } from './lap-max';
import { LapCounter } from './lap-counter';
import { LapTimer } from './lap-timer';
import { TotalTimer } from './total-timer';
export class SingletonHeader {

    public static totalTimer: TotalTimer;
    public static lapTimer: LapTimer;
    public static lapCounter: LapCounter;
    public static lapMax: LapMax;
    public static racePosition: RacePosition;

    public instanceTotalTimer(): TotalTimer {
        if (!SingletonHeader.totalTimer) {
            SingletonHeader.totalTimer = new TotalTimer();
        }
        return SingletonHeader.totalTimer;
    }

    public instanceTimerLap(): LapTimer {
        if (!SingletonHeader.lapTimer) {
            SingletonHeader.lapTimer = new LapTimer();
        }
        return SingletonHeader.lapTimer;
    }

    public instanceLapCounter(): LapCounter {
        if (!SingletonHeader.lapCounter) {
            SingletonHeader.lapCounter = new LapCounter();
        }
        return SingletonHeader.lapCounter;
    }

    public instanceLapMax(): LapMax {
        if (!SingletonHeader.lapMax) {
            SingletonHeader.lapMax = new LapMax();
        }
        return SingletonHeader.lapMax;
    }

    public instanceRacePosition(): RacePosition {
        if (!SingletonHeader.racePosition) {
            SingletonHeader.racePosition = new RacePosition();
        }
        return SingletonHeader.racePosition;
    }
}
