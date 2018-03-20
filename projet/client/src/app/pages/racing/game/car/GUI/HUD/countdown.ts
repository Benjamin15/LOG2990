import { SingletonAudio } from './../../../audio/singleton-audio';
import { ManagerAudio } from './../../../audio/manager-audio';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Timer } from './../../../../../../../../../commun/services/Timer';


const START = 10;
const NB_BIP = 3;

export class Countdown {
    private observer: Subject<string>;
    private timer: Timer;
    private managerAudio: ManagerAudio;
    private nbBip: number;

    public launch(managerAudio: ManagerAudio): void {
        this.managerAudio = managerAudio;
        this.timer = new Timer();
        this.timer.setStart(START);
        this.timer.startTimer();
        this.nbBip = NB_BIP;
    }

    public getObservable(): Observable<string> {
        this.observer = new Subject<string>();
        return this.observer.asObservable();
    }

    public update(): boolean {
        const countdown = this.timer.getTimer();
        if (countdown === 5 && this.nbBip === 5) {
            this.observer.next('GET READY');
            SingletonAudio.carManagerAudio.play('car start');
        } else if (countdown === 3 && this.nbBip === 3) {
            this.playBipSound(this.nbBip.toString());
        } else if (countdown === 2 && this.nbBip === 2) {
            this.playBipSound(this.nbBip.toString());
        } else if (countdown === 1 && this.nbBip === 1) {
            this.playBipSound(this.nbBip.toString());
        } else if (countdown === 0 && this.nbBip === 0) {
            this.playStartGameSound(this.nbBip.toString());
        } else if (countdown === -1) {
            this.observer.next('');
            return true;
        }
        return false;
    }

    private playBipSound(countdown: string): void {
        this.observer.next(countdown);
        this.managerAudio.loadCountdown();
        this.nbBip--;
    }

    private playStartGameSound(countdown: string): void {
        this.observer.next('Gooooo!');
        this.managerAudio.loadStartSound();
        this.nbBip--;
    }
}
