import { Car } from './../car';
import * as THREE from 'three';

export class CarLapsManager {

    private raycaster: THREE.Raycaster;
    public lapNumber: number;
    private canIncrement: boolean;
    public turncompleted: boolean;


    constructor(public car: Car, public scene: THREE.Scene) {
        this.raycaster = new THREE.Raycaster();
        this.lapNumber = 1;
        this.canIncrement = false;
        this.turncompleted = false;
    }

    public update() {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(this.car.getObjectByName('MainBody').matrixWorld);
        this.checkBounds(vector);
    }
    private checkBounds(vector: THREE.Vector3): number {
        const vectorPosition = new THREE.Vector3(vector.x, 100, vector.z);
        this.raycaster.set(vectorPosition, vector.sub(vectorPosition).normalize());
        const intersects = this.raycaster.intersectObject(this.scene.getObjectByName('startingGrid'));
        if (intersects.length !== 0 && this.canIncrement) {
            this.lapNumber += 1;
            this.turncompleted = true;
            this.canIncrement = false;
            return 1;
        } else if (intersects.length === 0) {
            this.canIncrement = true;
            return 0;
        }
        if (!this.canIncrement) {
            this.turncompleted = false;
        }
    }
}
