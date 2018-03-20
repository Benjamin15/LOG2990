import { RoadManagerService } from './../roadManagerService';
import { Car } from './../car/car';
import * as THREE from 'three';
import { CarManagerAudio } from '../audio/car-manager-audio';
import { SingletonAudio } from '../audio/singleton-audio';

const FRONT_LEFT_DETECTOR = 'frontLeftDetector';
const FRONT_RIGHT_DETECTOR = 'frontRightDetector';
const BACK_LEFT_DETECTOR = 'backLeftDetector';
const BACK_RIGHT_DETECTOR = 'backRightDetector';

export class ManagePotholes {
    private raycaster: THREE.Raycaster;
    private carManagerAudio: CarManagerAudio;

    constructor(public roadManager: RoadManagerService, public modelCar: Car) {
        this.carManagerAudio = new SingletonAudio().instanceCarAudio();
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
        const intersects = this.raycaster.intersectObjects(this.roadManager.obstacleCreatorService.potholesArray);
        if (intersects.length > 0) {
            if (!this.carManagerAudio.lastSound.source.isPlaying) {
                this.carManagerAudio.play('pothole');
            }
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

    public checkForIntersectionLeft(): boolean {
        let ifOnPothole = false;
        if (this.checkIfCollisonFrontLeft() ||
            this.checkIfCollisonBackRight()) {
            ifOnPothole = true;
        }
        return ifOnPothole;
    }

    public checkForIntersectionRight(): boolean {
        let ifOnPothole = false;
        if (this.checkIfCollisonFrontRight() ||
            this.checkIfCollisonBackLeft()) {
            ifOnPothole = true;
        }
        return ifOnPothole;
    }

    public potHolesReaction(car: Car) {
        for (let i = 0.4; i > 0.1; i -= 0.1) {
            car.translateX(+i);
            car.translateX(-i);
        }
    }
}
