import { SingletonAudio } from './../audio/singleton-audio';
import { SceneRaceService } from './../scene/scene.service';
import { Car } from './../car/car';
import * as THREE from 'three';

const DETECTOR = {
    FRONT_LEFT_DETECTOR: 'frontLeftDetector', FRONT_RIGHT_DETECTOR: 'frontRightDetector',
    BACK_LEFT_DETECTOR: 'backLeftDetector', BACK_RIGHT_DETECTOR: 'backRightDetector',
    FRONT_DETECTOR: 'frontDetector', BACK_DETECTOR: 'backDetector', TOP_TIME: 20,
    ATTENUATION: 0.05, TRANSLATION_FACTOR: 3, TRANSLATION_X: 2
};

export class ManageCollision {

    private cars: Array<Car>;
    private raycaster: THREE.Raycaster;
    private pushVector: Array<THREE.Vector3>;
    private translationSpeed: Array<number>;
    private canCheckForCollision: boolean;
    private divider: number;

    constructor(private scene: SceneRaceService, private car: Car) {
        this.findCars();
        this.raycaster = new THREE.Raycaster();
        this.pushVector = new Array<THREE.Vector3>();
        this.translationSpeed = new Array<number>();
        this.canCheckForCollision = true;
        this.divider = 1;
    }

    public update(): void {
        for (let i = 0; i < this.cars.length; i++) {
            this.initiateReactionIfNeeded(i);
            this.react(i);
        }
    }

    private initiateReactionIfNeeded(i: number): void {
        if (this.checkForIntersection(this.cars[i], this.car) === true && this.canCheckForCollision === true) {
            this.canCheckForCollision = false;
            const vector = new THREE.Vector3();
            const startPushVector = vector.setFromMatrixPosition(this.car.getObjectByName(DETECTOR.BACK_DETECTOR).matrixWorld);
            const vectorEnd = new THREE.Vector3();
            const endPushVector = vectorEnd.setFromMatrixPosition(this.car.getObjectByName(DETECTOR.FRONT_DETECTOR).matrixWorld);
            this.pushVector[i] = new THREE.Vector3(endPushVector.x - startPushVector.x,
                endPushVector.y - startPushVector.y, endPushVector.z - startPushVector.z);
            this.pushVector[i].normalize();
            this.translationSpeed[i] = this.car.physicsMovement.speed;
            if (this.cars[i].physicsMovement.acceleration < this.car.physicsMovement.acceleration) {
                if (this.cars[i].physicsMovement.canStartTimer) {
                    this.cars[i].physicsMovement.timer.setStart(20);
                    this.cars[i].physicsMovement.timer.startTimer();
                    this.cars[i].physicsMovement.canStartTimer = false;
                }
                this.car.physicsMovement.reduceCarSpeed();
                this.car.physicsMovement.stopCar();
                this.cars[i].physicsMovement.reduceCarSpeed();
                this.cars[i].physicsMovement.stopCar();
            }
        }
    }

    private react(i: number): void {
        if (this.cars[i].physicsMovement.timer.getTimer() >= (DETECTOR.TOP_TIME - this.translationSpeed[i]) &&
            this.cars[i].physicsMovement.canStartTimer === false && this.translationSpeed[i] !== undefined &&
            this.car.manageRoadLimit.checkForIntersection() === false) {
            this.cars[i].position.x += (this.pushVector[i].x * this.translationSpeed[i] / DETECTOR.TRANSLATION_FACTOR) / this.divider;
            this.cars[i].position.y += (this.pushVector[i].y * this.translationSpeed[i] / DETECTOR.TRANSLATION_FACTOR) / this.divider;
            this.cars[i].position.z += (this.pushVector[i].z * this.translationSpeed[i] / DETECTOR.TRANSLATION_FACTOR) / this.divider;
            this.car.position.x += -((this.pushVector[i].x * this.translationSpeed[i] / DETECTOR.TRANSLATION_FACTOR) / this.divider);
            this.car.position.y += -((this.pushVector[i].y * this.translationSpeed[i] / DETECTOR.TRANSLATION_FACTOR) / this.divider);
            this.car.position.z += -((this.pushVector[i].z * this.translationSpeed[i] / DETECTOR.TRANSLATION_FACTOR) / this.divider);
            this.divider += DETECTOR.ATTENUATION;
        } else if (this.cars[i].physicsMovement.timer.getTimer() < (DETECTOR.TOP_TIME - this.translationSpeed[i])) {
            this.cars[i].physicsMovement.canStartTimer = true;
            this.translationSpeed[i] = undefined;
            this.canCheckForCollision = true;
            this.divider = 1;
        }
    }
    private findCars(): void {
        const cars = new Array<Car>();
        if (this.car.name === 'player') {
            for (let i = 0; i < 3; i++) {
                cars.push(<Car>this.scene.getObjectByName('playerVirtual' + i));
            }
        } else {
            cars.push(<Car>this.scene.getObjectByName('player'));
            if (this.car.name === 'playerVirtual0') {
                for (let i = 1; i < 3; i++) {
                    cars.push(<Car>this.scene.getObjectByName('playerVirtual' + i));
                }
            } else if (this.car.name === 'playerVirtual1') {
                cars.push(<Car>this.scene.getObjectByName('playerVirtual0'));
                cars.push(<Car>this.scene.getObjectByName('playerVirtual2'));
            } else {
                for (let i = 0; i < 2; i++) {
                    cars.push(<Car>this.scene.getObjectByName('playerVirtual' + i));
                }
            }
        }
        this.cars = cars;
    }

    private checkBounds(vector: THREE.Vector3, car: Car): number {
        const vectorPosition = new THREE.Vector3(vector.x, 100, vector.z);
        this.raycaster.set(vectorPosition, vector.sub(vectorPosition).normalize());
        if (car.end) {
            return 0;
        }
        const intersects = this.raycaster.intersectObject(car.getObjectByName('lamborghini').getObjectByName('MainBody'));
        if (intersects.length > 0) {
            if (!SingletonAudio.carManagerAudio.lastSound.source.isPlaying) {
                SingletonAudio.carManagerAudio.play('collision');
            }
            return 1;
        } else {
            return 0;
        }
    }

    private checkFrontLeftSide(carToCollide: Car, carColliding: Car): number {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(carColliding.getObjectByName(DETECTOR.FRONT_RIGHT_DETECTOR).matrixWorld);
        return this.checkBounds(vector, carToCollide);
    }

    private checkFrontRightSide(carToCollide: Car, carColliding: Car): number {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(carColliding.getObjectByName(DETECTOR.FRONT_LEFT_DETECTOR).matrixWorld);
        return this.checkBounds(vector, carToCollide);
    }

    private checkBackRightSide(carToCollide: Car, carColliding: Car): number {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(carColliding.getObjectByName(DETECTOR.BACK_RIGHT_DETECTOR).matrixWorld);
        return this.checkBounds(vector, carToCollide);
    }

    private checkBackLeftSide(carToCollide: Car, carColliding: Car): number {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(carColliding.getObjectByName(DETECTOR.BACK_LEFT_DETECTOR).matrixWorld);
        return this.checkBounds(vector, carToCollide);
    }

    private checkFrontSide(carToCollide: Car, carColliding: Car): number {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(carColliding.getObjectByName(DETECTOR.FRONT_DETECTOR).matrixWorld);
        return this.checkBounds(vector, carToCollide);
    }

    public checkForIntersection(carToCollide: Car, carColliding: Car): boolean {
        let collision = false;
        if (this.checkFrontLeftSide(carToCollide, carColliding)) {
            collision = true;
        } else if (this.checkFrontRightSide(carToCollide, carColliding)) {
            collision = true;
        } else if (this.checkBackLeftSide(carToCollide, carColliding)) {
            collision = true;
        } else if (this.checkBackRightSide(carToCollide, carColliding)) {
            collision = true;
        } else if (this.checkFrontSide(carToCollide, carColliding)) {
            collision = true;
        }
        return collision;
    }
}
