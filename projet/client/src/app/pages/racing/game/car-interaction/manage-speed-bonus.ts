import { RoadManagerService } from './../roadManagerService';
import { Car } from './../car/car';
import * as THREE from 'three';

const FRONT_LEFT_DETECTOR = 'frontLeftDetector';
const FRONT_RIGHT_DETECTOR = 'frontRightDetector';
const BACK_LEFT_DETECTOR = 'backLeftDetector';
const BACK_RIGHT_DETECTOR = 'backRightDetector';

export class ManageSpeedBonus {
    private raycaster: THREE.Raycaster;

    constructor(public roadManager: RoadManagerService, public modelCar: Car) {
        this.raycaster = new THREE.Raycaster();
    }

    public checkIfCollisonFrontRight(): boolean {
        if (this.checkFrontRightSide()) {
            return true;
        }
        return false;
    }

    public checkIfCollisonFrontLeft(): boolean {
        if (this.checkFrontLeftSide()) {
            return true;
        }
        return false;
    }

    public checkIfCollisonBackLeft(): boolean {
        if (this.checkBackLeftSide()) {
            return true;
        }
        return false;
    }

    public checkIfCollisonBackRight(): boolean {
        if (this.checkBackRightSide()) {
            return true;
        }
        return false;
    }

    private checkBounds(vector: THREE.Vector3): number {
        const vectorPosition = new THREE.Vector3(vector.x, 100, vector.z);
        this.raycaster.set(vectorPosition, vector.sub(vectorPosition).normalize());
        const intersects = this.raycaster.intersectObjects(this.roadManager.obstacleCreatorService.speedBonusesArray);
        if (intersects.length > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    private checkFrontLeftSide(): number {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(this.modelCar.getObjectByName(FRONT_RIGHT_DETECTOR).matrixWorld);
        return this.checkBounds(vector);
    }

    private checkFrontRightSide(): number {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(this.modelCar.getObjectByName(FRONT_LEFT_DETECTOR).matrixWorld);
        return this.checkBounds(vector);
    }

    private checkBackRightSide(): number {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(this.modelCar.getObjectByName(BACK_RIGHT_DETECTOR).matrixWorld);
        return this.checkBounds(vector);
    }

    private checkBackLeftSide(): number {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(this.modelCar.getObjectByName(BACK_LEFT_DETECTOR).matrixWorld);
        return this.checkBounds(vector);
    }

    public checkForIntersection(): boolean {
        let onSpeedBonus = false;
        if (this.checkIfCollisonFrontLeft() &&
            this.checkIfCollisonFrontRight()) {
            onSpeedBonus = true;
        } else if (this.checkIfCollisonFrontLeft()) {
            onSpeedBonus = true;
        } else if (this.checkIfCollisonFrontRight()) {
            onSpeedBonus = true;
        } else if (this.checkIfCollisonBackLeft() && this.checkIfCollisonBackRight()) {
            onSpeedBonus = true;
        } else if (this.checkIfCollisonBackLeft()) {
            onSpeedBonus = true;
        } else if (this.checkIfCollisonBackRight()) {
            onSpeedBonus = true;
        }
        return onSpeedBonus;
    }
}
