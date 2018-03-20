import { RoadManagerService } from './../roadManagerService';
import { Car } from './../car/car';
import * as THREE from 'three';

const AMATOR = {
    DISTANCE: 40, TURN_FACTOR: 100, NAME: 'amateur', ANGLE: 0.1
};
const PROFESSIONAL = {
    DISTANCE: 90, TURN_FACTOR: 50, DECCELERATION: 0.0001, NAME: 'professionel'
};
const FRONT_DETECTOR = 'frontDetector';
const BACK_DETECTOR = 'backDetector';

export class ManagerDeplacementIa {

    private actualCarPosition: number;
    private carDirectionVector: THREE.Vector3;
    private carOrientationVector: THREE.Vector3;
    private distanceToNextPoint: number;

    constructor(private difficulty: string, private car: Car,
        private roadManager: RoadManagerService) {
        this.actualCarPosition = 0;
        this.carDirectionVector = new THREE.Vector3();
        this.carOrientationVector = new THREE.Vector3();
        this.distanceToNextPoint = 0;
    }

    public update(): void {
        this.processCarDirection();
        this.processCarOrientation();
        this.processCarDistanceFromPoint();
        if (this.difficulty === AMATOR.NAME) {
            this.updateNextPointAmator();
        } else if (this.difficulty === PROFESSIONAL.NAME) {
            this.updateNextPointProfessional();
        }
        this.updateCarMovement();
        this.car.update();
    }

    private processCarDirection(): void {
        const initiationVector = new THREE.Vector3();
        const carPositionVector = initiationVector.setFromMatrixPosition(this.car.matrixWorld);
        let index = 0;
        if (this.actualCarPosition + 1 === this.roadManager.checkPointsArray.length) {
            index = 0;
        } else {
            index = this.actualCarPosition;
        }
        const nextCheckPointDirection = new THREE.Vector3(this.roadManager.checkPointsArray[index + 1].x -
            carPositionVector.x, 0, this.roadManager.checkPointsArray[index + 1].z -
            carPositionVector.z);
        this.carDirectionVector = nextCheckPointDirection.normalize();
    }

    private processCarDistanceFromPoint(): void {
        const initiationVector = new THREE.Vector3();
        const carPositionVector = initiationVector.setFromMatrixPosition(this.car.matrixWorld);
        let index = 0;
        if (this.actualCarPosition + 1 === this.roadManager.checkPointsArray.length) {
            index = 0;
        } else {
            index = this.actualCarPosition;
        }
        const distance = carPositionVector.distanceTo(this.roadManager.checkPointsArray[index + 1]);
        this.distanceToNextPoint = distance;
    }

    private processCarOrientation(): void {
        const vector = new THREE.Vector3();
        const startPushVector = vector.setFromMatrixPosition(this.car.getObjectByName(BACK_DETECTOR).matrixWorld);
        const vectorEnd = new THREE.Vector3();
        const endPushVector = vectorEnd.setFromMatrixPosition(this.car.getObjectByName(FRONT_DETECTOR).matrixWorld);
        this.carOrientationVector = new THREE.Vector3(endPushVector.x - startPushVector.x,
            endPushVector.y - startPushVector.y, endPushVector.z - startPushVector.z);
        this.carOrientationVector.normalize();
    }

    private updateNextPointProfessional(): void {
        if (this.distanceToNextPoint <= ((Math.random() * (PROFESSIONAL.DISTANCE)))) {
            this.adjustIADirection();
        }
    }

    private updateNextPointAmator(): void {
        if (this.distanceToNextPoint <= ((Math.random() * (AMATOR.DISTANCE)))) {
            this.adjustIADirection();
        }
    }

    private adjustIADirection(): void {
        if (this.actualCarPosition === (this.roadManager.checkPointsArray.length - 1)) {
            this.actualCarPosition = 0;
        } else {
            this.actualCarPosition += 1;
        }
    }

    private updateCarMovement(): void {
        this.car.setMovementForward();
        if (this.carOrientationVector.angleTo(this.carDirectionVector) > AMATOR.ANGLE) {
            if (this.difficulty === PROFESSIONAL.NAME) {
                this.car.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.carOrientationVector.angleTo(
                    this.carDirectionVector) / PROFESSIONAL.TURN_FACTOR);
            } else if (this.difficulty === AMATOR.NAME) {
                this.car.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.carOrientationVector.angleTo(
                    this.carDirectionVector) / AMATOR.TURN_FACTOR);
            }
            this.car.physicsMovement.speed -= PROFESSIONAL.DECCELERATION;
        }
    }
}
