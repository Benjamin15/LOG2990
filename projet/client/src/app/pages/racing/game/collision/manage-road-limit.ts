import { ManagePotholes } from './../car-interaction/manage-potholes-reaction';
import { RoadManagerService } from './../roadManagerService';
import { Car } from './../car/car';
import * as THREE from 'three';
import { ManageSpeedBonus } from '../car-interaction/manage-speed-bonus';
import { ManagePuddles } from './../car-interaction/manage-aquaplaning';
import { SingletonAudio } from './../audio/singleton-audio';

const HALF_CAR_WIDTH = 1.5;
const HALF_CAR_LENGTH = 1.5;
const FRONT_LENGTH = 1.75;
const FRONT_LEFT_DETECTOR = 'frontLeftDetector';
const FRONT_RIGHT_DETECTOR = 'frontRightDetector';
const BACK_LEFT_DETECTOR = 'backLeftDetector';
const BACK_RIGHT_DETECTOR = 'backRightDetector';
const FRONT_DETECTOR = 'frontDetector';
const BACK_DETECTOR = 'backDetector';

export class ManageRoadLimit {

    private collisionDetectors: Array<THREE.Vector3>;
    private raycaster: THREE.Raycaster;
    private manageSpeedBonus: ManageSpeedBonus;
    private managePotholes: ManagePotholes;
    private managePuddles: ManagePuddles;
    private isHittingLimit: boolean;

    constructor(public roadManager: RoadManagerService, public modelCar: Car) {
        this.collisionDetectors = new Array<THREE.Vector3>();
        this.raycaster = new THREE.Raycaster();
        this.manageSpeedBonus = new ManageSpeedBonus(roadManager, modelCar);
        this.managePotholes = new ManagePotholes(roadManager, modelCar);
        this.managePuddles = new ManagePuddles(roadManager, modelCar);
        this.initializeDetectors();
        this.initializeObjects();
        this.isHittingLimit = false;
    }

    private initializeObjects(): void {
        const frontLeftDetector = new THREE.Object3D();
        frontLeftDetector.name = FRONT_LEFT_DETECTOR;
        frontLeftDetector.position.set(this.collisionDetectors[0].x, this.collisionDetectors[0].y, this.collisionDetectors[0].z);
        const frontRightDetector = new THREE.Object3D();
        frontRightDetector.name = FRONT_RIGHT_DETECTOR;
        frontRightDetector.position.set(this.collisionDetectors[1].x, this.collisionDetectors[1].y, this.collisionDetectors[1].z);
        const backLeftDetector = new THREE.Object3D();
        backLeftDetector.name = BACK_LEFT_DETECTOR;
        backLeftDetector.position.set(this.collisionDetectors[3].x, this.collisionDetectors[3].y, this.collisionDetectors[3].z);
        const backRightDetector = new THREE.Object3D();
        backRightDetector.name = BACK_RIGHT_DETECTOR;
        backRightDetector.position.set(this.collisionDetectors[2].x, this.collisionDetectors[2].y, this.collisionDetectors[2].z);
        const frontDetector = new THREE.Object3D();
        frontDetector.name = FRONT_DETECTOR;
        frontDetector.position.set(this.collisionDetectors[4].x, this.collisionDetectors[4].y, this.collisionDetectors[4].z);
        const backDetector = new THREE.Object3D();
        backDetector.name = BACK_DETECTOR;
        backDetector.position.set(this.collisionDetectors[5].x, this.collisionDetectors[5].y, this.collisionDetectors[5].z);
        this.modelCar.add(frontLeftDetector);
        this.modelCar.add(frontRightDetector);
        this.modelCar.add(backLeftDetector);
        this.modelCar.add(backRightDetector);
        this.modelCar.add(frontDetector);
        this.modelCar.add(backDetector);
    }

    private initializeDetectors(): void {
        this.collisionDetectors.push(new THREE.Vector3(this.modelCar.position.x + HALF_CAR_WIDTH,
            this.modelCar.position.y,
            this.modelCar.position.z - HALF_CAR_LENGTH));
        this.collisionDetectors.push(new THREE.Vector3(this.modelCar.position.x - HALF_CAR_WIDTH,
            this.modelCar.position.y,
            this.modelCar.position.z - HALF_CAR_LENGTH));
        this.collisionDetectors.push(new THREE.Vector3(this.modelCar.position.x - HALF_CAR_WIDTH,
            this.modelCar.position.y,
            this.modelCar.position.z + HALF_CAR_LENGTH));
        this.collisionDetectors.push(new THREE.Vector3(this.modelCar.position.x + HALF_CAR_WIDTH,
            this.modelCar.position.y,
            this.modelCar.position.z + HALF_CAR_LENGTH));
        this.collisionDetectors.push(new THREE.Vector3(this.modelCar.position.x,
            this.modelCar.position.y,
            this.modelCar.position.z - FRONT_LENGTH));
        this.collisionDetectors.push(new THREE.Vector3(this.modelCar.position.x,
            this.modelCar.position.y,
            this.modelCar.position.z + FRONT_LENGTH));
    }

    public checkIfCollisonFrontRight(): boolean {
        if (this.checkFrontRightSide()) {
            return true;
        }
        return false;
    }

    public checkIfSpeedBonus(): boolean {
        return this.manageSpeedBonus.checkForIntersection();
    }

    public checkIfPuddles(): boolean {
        return this.managePuddles.checkForIntersection();
    }

    public checkIfPotholesRight(): boolean {
        return this.managePotholes.checkForIntersectionRight();
    }

    public checkIfPotholesLeft(): boolean {
        return this.managePotholes.checkForIntersectionLeft();
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
        const intersects = this.raycaster.intersectObjects(this.roadManager.planesArray);
        if (intersects.length === 0) {
            if (!this.isHittingLimit && !SingletonAudio.carManagerAudio.lastSound.source.isPlaying) {
                SingletonAudio.carManagerAudio.play('limit');
                this.isHittingLimit = true;
            }
            return 1;
        } else {
            this.isHittingLimit = false;
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
        let collision = false;
        if (this.checkIfCollisonFrontLeft()) {
            collision = true;
        } else if (this.checkIfCollisonFrontRight()) {
            collision = true;
        } else if (this.checkIfCollisonBackLeft()) {
            collision = true;
        } else if (this.checkIfCollisonBackRight()) {
            collision = true;
        }
        return collision;
    }
}
