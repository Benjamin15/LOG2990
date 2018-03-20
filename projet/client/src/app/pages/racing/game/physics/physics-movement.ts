import { PhysicsSpeedBonus } from './physics-speedBonus';
import { SceneRaceService } from './../scene/scene.service';
import { ManageCollision } from './../collision/manage-collision';
import { Timer } from './../../../../../../../commun/services/Timer';
import { Car } from './../car/car';

const CARACTERISTICS = {
    SPEED_MAX: 3, COEF_CINETIC_WHEEL: 0.35, MULT: 2 / 3, POW: 3 / 2, POW_DEC: 2,
    MOVE: 0.01, SPEED_DIVIDER: 2, POTHOLE_SPEED: 0.11, POTHOLE_TRANSLATE: 0.01

};

export class PhysicsMovement {
    public acceleration: number;
    public isAccelerate: boolean;
    public speed: number;
    public speedInitial: number;
    public canStartTimer: boolean;

    private managerCollision: ManageCollision;
    public timer: Timer;
    public physicsSpeedBonus: PhysicsSpeedBonus;

    constructor(scene: SceneRaceService, car: Car) {
        this.speedInitial = 0;
        this.speed = 0;
        this.acceleration = 0;
        this.isAccelerate = false;
        this.timer = new Timer();
        this.managerCollision = new ManageCollision(scene, car);
        this.physicsSpeedBonus = new PhysicsSpeedBonus(scene, car);
        this.canStartTimer = true;
    }

    public startAccelerate(): void {
        this.speedInitial = this.speed;
        this.timer.startTimer();
        this.isAccelerate = true;
    }

    public stopAccelerate(): void {
        this.speedInitial = this.speed;
        this.timer.startTimer();
        this.isAccelerate = false;
    }

    public stopCar(): void {
        this.isAccelerate = false;
        this.speed = 0;
        this.acceleration = 0;
    }

    public reduceCarSpeed(): void {
        this.speed = this.speed / CARACTERISTICS.SPEED_DIVIDER;
    }

    public onPotholeRightWheel(car: Car): void {
        this.isAccelerate = false;
        this.speed = CARACTERISTICS.POTHOLE_SPEED;
        this.acceleration = CARACTERISTICS.POTHOLE_SPEED;
        car.translateX(+CARACTERISTICS.POTHOLE_TRANSLATE);
        car.translateY(-CARACTERISTICS.POTHOLE_TRANSLATE);
    }

    public onPotholeLeftWheel(car: Car): void {
        this.isAccelerate = false;
        this.speed = CARACTERISTICS.POTHOLE_SPEED;
        this.acceleration = CARACTERISTICS.POTHOLE_SPEED;
        car.translateX(-CARACTERISTICS.POTHOLE_TRANSLATE);
        car.translateY(-CARACTERISTICS.POTHOLE_TRANSLATE);
    }

    public giveSpeedBonus(): void {
        this.physicsSpeedBonus.startSpeedBonus();
    }

    public update(): void {
        const time = this.timer.getcountDown();
        this.managerCollision.update();
        if (this.isAccelerate) {
            this.acceleration = Math.sqrt(time);
            const speedActual = this.speedInitial + CARACTERISTICS.MULT * Math.pow(time, (CARACTERISTICS.POW));
            this.speed = (speedActual > CARACTERISTICS.SPEED_MAX &&
                this.physicsSpeedBonus.hasSpeedBonus === false) ? CARACTERISTICS.SPEED_MAX : speedActual;
            this.speed *= CARACTERISTICS.COEF_CINETIC_WHEEL;
        } else {
            this.acceleration = 0 - time;
            const speedActual = this.speedInitial - (Math.pow(time, CARACTERISTICS.POW_DEC) / CARACTERISTICS.POW_DEC);
            this.speed = (speedActual > 0) ? speedActual : 0;
            this.speed *= CARACTERISTICS.COEF_CINETIC_WHEEL;
        }
        this.speed = this.physicsSpeedBonus.update(this.speed);
    }

    public collider(car: Car): void {
        this.speed += (this.speed === 0) ? CARACTERISTICS.MOVE : 0;
        this.timer.startTimer();
        this.speedInitial = car.physicsMovement.speed;
        car.physicsMovement.speedInitial = car.physicsMovement.speed;
        car.physicsMovement.timer.startTimer();
        this.acceleration = (this.isAccelerate) ? Math.abs(car.physicsMovement.acceleration) : -Math.abs(car.physicsMovement.acceleration);
    }
}
