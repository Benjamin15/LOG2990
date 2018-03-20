import { ManagerCarPositionRanking } from './race-cars-ranking/cars-position-ranking';
import { CarLapsManager } from './race-cars-ranking/car-laps-manager';
import { SingletonAudio } from './../audio/singleton-audio';
import { PhysicsAquaplaning } from './../physics/physics-aquaplaning';
import { PhysicsMovement } from './../physics/physics-movement';
import { ManagerLight } from './light/manager-light';
import { SceneRaceService } from './../scene/scene.service';
import * as THREE from 'three';
import { StateMovement } from './state-movement/state-movement';
import { StateMovementCollision } from './state-movement/state-movement-collision';
import { StateMovementBreak } from './state-movement/state-movement-break';
import { StateMovementForwards } from './state-movement/state-movement-forward';
import { StateMovementLeft } from './state-movement/state-movement-left';
import { StateMovementRight } from './state-movement/state-movement-right';
import { StateMovementForwardLeft } from './state-movement/state-movement-forward-left';
import { StateMovementForwardRight } from './state-movement/state-movement-forward-right';
import { ManageCarCreation } from './GUI/manage-car-creation';
import { ManageRoadLimit } from './../collision/manage-road-limit';
import { RoadManagerService } from './../roadManagerService';
import { CarManagerAudio } from './../audio/car-manager-audio';

const POSITIONY = -19.2;
export class Car extends THREE.Object3D {

    public stateMovement: StateMovement;
    private managerLight: ManagerLight;

    public physicsMovement: PhysicsMovement;
    public manageRoadLimit: ManageRoadLimit;
    public manageCarPosition: ManagerCarPositionRanking;
    public physicsAquaplaning: PhysicsAquaplaning;
    public lapsManager: CarLapsManager;

    public carManagerAudio: CarManagerAudio;
    public antirebond: boolean;

    public end: boolean;
    constructor(name: string, roadManager?: RoadManagerService) {
        super();
        this.name = name;
        this.stateMovement = new StateMovementBreak(this);
        this.manageRoadLimit = new ManageRoadLimit(roadManager, this);
        this.managerLight = new ManagerLight(this);
        this.carManagerAudio = new SingletonAudio().instanceCarAudio();
        this.end = false;
        this.antirebond = false;
        this.manageCarPosition = new ManagerCarPositionRanking(this, roadManager);
    }

    public update(): void {
        if (!this.end) {
            this.manageCarPosition.update();
            this.physicsMovement.update();
            this.lapsManager.update();
            this.physicsAquaplaning.update(this);
            this.reactOnObject();
            this.reactIfcollision();
        }
    }

    public render(): void {
        try {
            if (!this.end) {
                this.stateMovement.render(this.physicsMovement.speed);
            }
        } catch (e) {
            this.stateMovement = new StateMovementBreak(this);
        }
    }

    public reactIfcollision(): void {
        if (this.manageRoadLimit.checkIfCollisonFrontLeft() &&
            this.manageRoadLimit.checkIfCollisonFrontRight()) {
            this.physicsMovement.stopCar();
            this.translateZ(1);
        } else if (this.manageRoadLimit.checkIfCollisonFrontLeft()) {
            this.setMovementRight();
            this.physicsMovement.reduceCarSpeed();
            this.physicsMovement.stopCar();
        } else if (this.manageRoadLimit.checkIfCollisonFrontRight()) {
            this.setMovementLeft();
            this.physicsMovement.reduceCarSpeed();
            this.physicsMovement.stopCar();
        } else if (this.manageRoadLimit.checkIfCollisonBackLeft() && this.manageRoadLimit.checkIfCollisonBackRight()) {
            this.physicsMovement.stopCar();
            this.translateZ(-1);
            this.setMovementForward();
        } else if (this.manageRoadLimit.checkIfCollisonBackLeft()) {
            this.physicsMovement.reduceCarSpeed();
        } else if (this.manageRoadLimit.checkIfCollisonBackLeft()) {
            this.physicsMovement.reduceCarSpeed();
        }
    }

    public reactOnObject(): void {
        if (this.manageRoadLimit.checkIfSpeedBonus()) {
            this.physicsMovement.giveSpeedBonus();
        }
        if (this.manageRoadLimit.checkIfPotholesRight()) {
            this.physicsMovement.onPotholeRightWheel(this);
        } else if (this.manageRoadLimit.checkIfPotholesLeft()) {
            this.physicsMovement.onPotholeLeftWheel(this);
        } else {
            this.position.y = POSITIONY;
        }
        if (this.manageRoadLimit.checkIfPuddles() && this.antirebond === false) {
            this.physicsAquaplaning.startAquaplaning(this);
            this.antirebond = true;
        } else if (this.manageRoadLimit.checkIfPuddles() === false) {
            this.antirebond = false;
        }
    }

    public copyRoads(roadManagerService: RoadManagerService): void {
        this.manageRoadLimit = new ManageRoadLimit(roadManagerService, this);
    }

    public setLightOn(): void {
        this.managerLight = new ManagerLight(this);
    }

    public setMovementCollision(car: Car): void {
        this.stateMovement = new StateMovementCollision(this, car);
    }

    public setMovementRight(): void {
        if (!this.physicsMovement.isAccelerate) {
            this.physicsMovement.startAccelerate();
        }
        this.stateMovement = new StateMovementRight(this);
    }

    public setMovementLeft(): void {
        if (!this.physicsMovement.isAccelerate) {
            this.physicsMovement.startAccelerate();
        }
        this.stateMovement = new StateMovementLeft(this);
    }

    public setMovementForward(): void {
        if (!this.physicsMovement.isAccelerate) {
            this.physicsMovement.startAccelerate();
        }
        this.stateMovement = new StateMovementForwards(this);
    }

    public setMovementForwardLeft(): void {
        if (this.physicsMovement.speed > 0) {
            this.stateMovement = new StateMovementForwardLeft(this);
        }
    }

    public setMovementForwardRight(): void {
        if (this.physicsMovement.speed > 0) {
            this.stateMovement = new StateMovementForwardRight(this);
        }
    }

    public setMovementBreak(): void {
        if (this.physicsMovement.isAccelerate) {
            this.physicsMovement.stopAccelerate();
        }
        this.stateMovement = new StateMovementBreak(this);
        this.update();
    }

    public getStateMovement(): StateMovement {
        return this.stateMovement;
    }

    public getLight(): ManagerLight {
        return this.managerLight;
    }

    public createObject(scene: SceneRaceService, position: THREE.Vector3): void {
        const manageCarCreation = new ManageCarCreation();
        manageCarCreation.createCar(scene, position, this);
    }

    public launchPhysics(roadManagerService: RoadManagerService, scene: SceneRaceService): void {
        this.physicsMovement = new PhysicsMovement(scene, this);
        this.manageRoadLimit = new ManageRoadLimit(roadManagerService, this);
        this.physicsAquaplaning = new PhysicsAquaplaning(scene, this);
        this.lapsManager = new CarLapsManager(this, scene);
    }
}
