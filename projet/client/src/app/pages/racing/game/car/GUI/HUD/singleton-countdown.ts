import { Countdown } from './countdown';

export class SingletonCountdown {
    public static countdown: Countdown;

    public instance(): Countdown {
        if (!SingletonCountdown.countdown) {
            SingletonCountdown.countdown = new Countdown();
        }
        return SingletonCountdown.countdown;
    }
}
