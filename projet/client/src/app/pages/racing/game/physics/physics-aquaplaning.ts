import { SceneRaceService } from './../scene/scene.service';
import { Timer } from './../../../../../../../commun/services/Timer';
import { Car } from './../car/car';
import * as THREE from 'three';

const AQUAPLANING = {
    DECCELERATION: 0.00000005, NUMBER_OF_COMPARISON: 0.0000001,
    FRONT_DETECTOR: 'frontDetector', BACK_DETECTOR: 'backDetector', HIGHER_RANDOM: 10,
    ANGLE_ATTENUATION: 0.04, DURATION_PROLONGATION: 1.5, TIMER_LIMIT: 20, SPEED_ATTENUATION: 0.05,
    MIDDLE_INTERVAL: 5, ANGLE_DIVIDER: 2, SPEED_COMPARISON_FACTOR: 3
};

export class PhysicsAquaplaning {
    public isAquaplaning: boolean;
    public timer: Timer;
    private slidingVector: THREE.Vector3;
    private duration: number;
    private divider: number;
    private rotateAngle: number;

    constructor(scene: SceneRaceService, car: Car) {
        this.isAquaplaning = false;
        this.timer = new Timer();
        this.rotateAngle = 0;
        this.duration = 0;
        this.divider = 1;
    }

    public startAquaplaning(car: Car): void {
        this.timer.setStart(20);
        this.timer.startTimer();
        this.isAquaplaning = true;
        const vector = new THREE.Vector3();
        const startPushVector = vector.setFromMatrixPosition(car.getObjectByName(AQUAPLANING.BACK_DETECTOR).matrixWorld);
        const vectorEnd = new THREE.Vector3();
        const endPushVector = vectorEnd.setFromMatrixPosition(car.getObjectByName(AQUAPLANING.FRONT_DETECTOR).matrixWorld);
        this.slidingVector = new THREE.Vector3(endPushVector.x - startPushVector.x,
            endPushVector.y - startPushVector.y, endPushVector.z - startPushVector.z);
        this.slidingVector.normalize();
        this.duration = car.physicsMovement.speed;
        const random = Math.floor(Math.random() * (AQUAPLANING.HIGHER_RANDOM) + 1);
        if (random >= AQUAPLANING.MIDDLE_INTERVAL) {
            this.rotateAngle = Math.PI / AQUAPLANING.ANGLE_DIVIDER * AQUAPLANING.ANGLE_ATTENUATION;
        } else {
            this.rotateAngle = -Math.PI / AQUAPLANING.ANGLE_DIVIDER * AQUAPLANING.ANGLE_ATTENUATION;
        }
    }

    public update(car: Car): void {
        if (this.isAquaplaning === true && this.timer.getTimer() >= AQUAPLANING.TIMER_LIMIT -
            (this.duration * AQUAPLANING.DURATION_PROLONGATION) && car.manageRoadLimit.checkForIntersection() === false) {
            car.position.x += (this.slidingVector.x * this.duration) / this.divider;
            car.position.y += (this.slidingVector.y * this.duration) / this.divider;
            car.position.z += (this.slidingVector.z * this.duration) / this.divider;
            car.rotateOnAxis(new THREE.Vector3(0, 1, 0), (this.rotateAngle * this.duration) / this.divider);
            car.physicsMovement.speed = 0;
            this.divider += AQUAPLANING.SPEED_ATTENUATION;
        } else if (this.isAquaplaning === true && this.timer.getTimer() < AQUAPLANING.TIMER_LIMIT -
            (this.duration * AQUAPLANING.DURATION_PROLONGATION) && this.timer.getTimer() > 0) {
            car.physicsMovement.speed -= AQUAPLANING.DECCELERATION;
            if (Math.abs(car.physicsMovement.speed - AQUAPLANING.SPEED_COMPARISON_FACTOR) >= AQUAPLANING.NUMBER_OF_COMPARISON) {
                this.isAquaplaning = false;
                car.physicsMovement.reduceCarSpeed();
                car.physicsMovement.stopCar();
                this.divider = 1;
            }
        }
    }
}
