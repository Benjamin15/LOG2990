import { Player } from './../players/player';
import { RoadManagerService } from './../roadManagerService';
import * as THREE from 'three';

export class ManagerCheckSense {

    public halfway: boolean;
    public actualPosition: THREE.Vector3;

    private index: number;
    private isGoodWay: boolean;
    private raycaster: THREE.Raycaster;
    private canIncrement: boolean;

    constructor(private player: Player, private roadManager: RoadManagerService, private scene: THREE.Scene) {
        this.index = 0;
        this.actualPosition = this.player.car.position;
        this.halfway = false;
        this.raycaster = new THREE.Raycaster();
        this.canIncrement = false;
    }

    public checkSense(): void {
        const vector = new THREE.Vector3();
        vector.copy(this.player.car.position);
        this.index = this.checkCarPositionOnPist(vector);
        const angle = this.determineCarDirection().angleTo(this.roadManager.outsideVectors[this.index]);
        this.isGoodWay = Math.abs(angle) < Math.PI / 2;
    }


    public determineCarDirection(): THREE.Vector3 {
        const vector = new THREE.Vector3();
        this.player.camera.cameraPerspective.getWorldDirection(vector);
        return vector;
    }

    public getIsGoodWay(): boolean {
        return this.isGoodWay;
    }

    public checkHalfway(): void {
        if (this.isGoodWay) {
            if (this.actualPosition.x < 0 && this.actualPosition.z < -100) {
                this.halfway = true;
            }
        }
    }

    public checkCarPositionOnPist(vector: THREE.Vector3): number {
        const raycaster = new THREE.Raycaster();
        const vectorPosition = new THREE.Vector3(vector.x, 100, vector.z);
        raycaster.set(vectorPosition, vector.sub(vectorPosition).normalize());
        for (let i = 0; i < this.roadManager.planesArray.length; i++) {
            const intersects = raycaster.intersectObject(this.roadManager.planesArray[i]);
            if (intersects.length !== 0) {
                return i;
            }
        }
        return 1;
    }

    private checkBounds(vector: THREE.Vector3): number {
        const vectorPosition = new THREE.Vector3(vector.x, 100, vector.z);
        this.raycaster.set(vectorPosition, vector.sub(vectorPosition).normalize());
        const intersects = this.raycaster.intersectObject(this.scene.getObjectByName('startingGrid'));
        if (intersects.length !== 0 && this.canIncrement) {
            this.canIncrement = false;
            return 1;
        } else if (intersects.length === 0) {
            this.canIncrement = true;
            return 0;
        }
    }

    public checkIfPlayerEnded(): number {
        const playerVector = new THREE.Vector3();
        playerVector.setFromMatrixPosition(this.scene.getObjectByName('MirrorPerspective').matrixWorld);
        return this.checkBounds(playerVector);
    }
}
