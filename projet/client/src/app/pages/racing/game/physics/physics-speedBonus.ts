import { SceneRaceService } from './../scene/scene.service';
import { CarManagerAudio } from './../audio/car-manager-audio';
import { SingletonAudio } from './../audio/singleton-audio';
import { setTimeout } from 'timers';
import { Timer } from './../../../../../../../commun/services/Timer';
import { Car } from './../car/car';

const BONUS_SPEED = 4.5;
const DECCELERATION = 0.00000005;
const NUMBER_OF_COMPARISON = 0.0000001;
const TIMPE_PASSED = 19.7;

export class PhysicsSpeedBonus {
    public hasSpeedBonus: boolean;
    public isOnSpeedBonus: boolean;
    public timer: Timer;
    public countDown: Timer;

    private endNitro: NodeJS.Timer;

    constructor(scene: SceneRaceService, car: Car) {
        this.hasSpeedBonus = false;
        this.isOnSpeedBonus = false;
        this.timer = new Timer();
        this.countDown = new Timer();
    }

    public startSpeedBonus(): void {
        const COUNTDOWN = 20;
        this.timer.setStart(COUNTDOWN);
        this.timer.startTimer();
        this.hasSpeedBonus = true;
    }

    public update(speed: number): number {
        const carManagerAudio = new SingletonAudio().instanceCarAudio();
        if (this.hasSpeedBonus === true && this.timer.getTimer() >= TIMPE_PASSED) {
            this.manageStartNitro(carManagerAudio);
            speed = BONUS_SPEED;
        } else if (this.hasSpeedBonus === true && this.timer.getTimer() < TIMPE_PASSED && this.timer.getTimer() > 0) {
            speed -= DECCELERATION;
            if (Math.abs(speed - 3) >= NUMBER_OF_COMPARISON) {
                this.hasSpeedBonus = false;
            }
        }
        return speed;
    }

    private manageStartNitro(carManagerAudio: CarManagerAudio): void {
        const NITRO = 'start nitro';
        clearTimeout(this.endNitro);
        if (!this.isOnSpeedBonus ) {
            carManagerAudio.play(NITRO);
            this.manageEndNitro(carManagerAudio);
            this.isOnSpeedBonus = true;
        }
    }

    private manageEndNitro(carManagerAudio: CarManagerAudio): void {
        const NITRO = 'end nitro';
        this.endNitro = setTimeout(() => {
            carManagerAudio.play(NITRO);
            this.isOnSpeedBonus = false;
        }, 1500);
    }
}
