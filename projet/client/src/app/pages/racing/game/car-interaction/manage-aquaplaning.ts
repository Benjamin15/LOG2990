import { RoadManagerService } from './../roadManagerService';
import { CarManagerAudio } from './../audio/car-manager-audio';
import { SingletonAudio } from './../audio/singleton-audio';
import { Car } from './../car/car';
import * as THREE from 'three';

const FRONT_LEFT_DETECTOR = 'frontLeftDetector';
const FRONT_RIGHT_DETECTOR = 'frontRightDetector';
const BACK_LEFT_DETECTOR = 'backLeftDetector';
const BACK_RIGHT_DETECTOR = 'backRightDetector';

export class ManagePuddles {
    private raycaster: THREE.Raycaster;
    private carManagerAudio: CarManagerAudio;
    private isOnPuddle: boolean;

    constructor(public roadManager: RoadManagerService, public modelCar: Car) {
        this.carManagerAudio = new SingletonAudio().instanceCarAudio();
        this.raycaster = new THREE.Raycaster();
        this.isOnPuddle = false;
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
        const intersects = this.raycaster.intersectObjects(this.roadManager.obstacleCreatorService.puddlesArray);
        if (intersects.length > 0) {
            if (!this.isOnPuddle) {
                this.carManagerAudio.play('puddling');
                this.isOnPuddle = true;
            }
            return 1;
        } else {
            this.isOnPuddle = false;
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
        let aquaPlaning = false;
        if (this.checkIfCollisonFrontLeft() &&
            this.checkIfCollisonFrontRight()) {
            aquaPlaning = true;
        } else if (this.checkIfCollisonFrontLeft()) {
            aquaPlaning = true;
        } else if (this.checkIfCollisonFrontRight()) {
            aquaPlaning = true;
        } else if (this.checkIfCollisonBackLeft() && this.checkIfCollisonBackRight()) {
            aquaPlaning = true;
        } else if (this.checkIfCollisonBackLeft()) {
            aquaPlaning = true;
        } else if (this.checkIfCollisonBackLeft()) {
            aquaPlaning = true;
        }
        return aquaPlaning;
    }
}
