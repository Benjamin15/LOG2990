import { Car } from './../car';
import * as THREE from 'three';

const VIRTUAL0 = 'playerVirtual0';
const VIRTUAL1 = 'playerVirtual1';
const VIRTUAL2 = 'playerVirtual2';
const PLAYER = 'MirrorPerspective';
const VIRTUAL = 'playerVirtual';
const INDEXES = {
    CASEZERO: 0, CASEONE: 1, CASETWO: 2, CASETHREE: 3
};

export class ManagerCarSort {

    private kartsSegmentCrossed: Array<number>;
    private distance: Array<number>;
    private playerPosition: number;
    private sameSegmentAsPlayer: Array<number>;

    constructor(private scene: THREE.Scene) {
        const size = 4;
        this.kartsSegmentCrossed = new Array<number>(size);
        this.distance = new Array<number>(size);
        this.playerPosition = 1;
        this.sameSegmentAsPlayer = new Array<number>();
    }

    public getPlayerPosition(name?: string): number {
        if (name === VIRTUAL0) {
            this.registerAsAnIa0();
        } else if (name === VIRTUAL1) {
            this.registerAsAnIa1();
        } else if (name === VIRTUAL2) {
            this.registerAsAnIa2();
        } else {
            this.registerCars();
        }
        this.sortCars();
        return this.sameSegmentSort();
    }

    private registerCars(): void {
        for (let i = 0; i < 3; i++) {
            const carIa = <Car>this.scene.getObjectByName(VIRTUAL + i);
            this.kartsSegmentCrossed[i] = carIa.manageCarPosition.segmentsCrossed;
            this.distance[i] = carIa.manageCarPosition.distanceToNextPoint;
        }
        const car = <Car>this.scene.getObjectByName(PLAYER);
        this.kartsSegmentCrossed[INDEXES.CASETHREE] = car.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASETHREE] = car.manageCarPosition.distanceToNextPoint;
    }

    private registerAsAnIa0(): void {
        for (let i = 1; i <= 2; i++) {
            const carIa = <Car>this.scene.getObjectByName(VIRTUAL + i);
            this.kartsSegmentCrossed[i] = carIa.manageCarPosition.segmentsCrossed;
            this.distance[i] = carIa.manageCarPosition.distanceToNextPoint;
        }
        const carPlayer = <Car>this.scene.getObjectByName(PLAYER);
        this.kartsSegmentCrossed[INDEXES.CASEZERO] = carPlayer.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASEZERO] = carPlayer.manageCarPosition.distanceToNextPoint;
        const car = <Car>this.scene.getObjectByName(VIRTUAL0);
        this.kartsSegmentCrossed[INDEXES.CASETHREE] = car.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASETHREE] = car.manageCarPosition.distanceToNextPoint;
    }

    private registerAsAnIa2(): void {
        const carVirtual0 = <Car>this.scene.getObjectByName(VIRTUAL0);
        this.kartsSegmentCrossed[INDEXES.CASEZERO] = carVirtual0.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASEZERO] = carVirtual0.manageCarPosition.distanceToNextPoint;
        const carVirtual1 = <Car>this.scene.getObjectByName(VIRTUAL1);
        this.kartsSegmentCrossed[INDEXES.CASEONE] = carVirtual1.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASEONE] = carVirtual1.manageCarPosition.distanceToNextPoint;
        const carPlayer = <Car>this.scene.getObjectByName(PLAYER);
        this.kartsSegmentCrossed[INDEXES.CASETWO] = carPlayer.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASETWO] = carPlayer.manageCarPosition.distanceToNextPoint;
        const car = <Car>this.scene.getObjectByName(VIRTUAL2);
        this.kartsSegmentCrossed[INDEXES.CASETHREE] = car.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASETHREE] = car.manageCarPosition.distanceToNextPoint;
    }

    private registerAsAnIa1(): void {
        const carVirtual0 = <Car>this.scene.getObjectByName(VIRTUAL0);
        this.kartsSegmentCrossed[INDEXES.CASEZERO] = carVirtual0.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASEZERO] = carVirtual0.manageCarPosition.distanceToNextPoint;
        const carVirtual1 = <Car>this.scene.getObjectByName(VIRTUAL1);
        this.kartsSegmentCrossed[INDEXES.CASETHREE] = carVirtual1.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASETHREE] = carVirtual1.manageCarPosition.distanceToNextPoint;
        const carPlayer = <Car>this.scene.getObjectByName(PLAYER);
        this.kartsSegmentCrossed[INDEXES.CASETWO] = carPlayer.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASETWO] = carPlayer.manageCarPosition.distanceToNextPoint;
        const car = <Car>this.scene.getObjectByName(VIRTUAL2);
        this.kartsSegmentCrossed[INDEXES.CASEONE] = car.manageCarPosition.segmentsCrossed;
        this.distance[INDEXES.CASEONE] = car.manageCarPosition.distanceToNextPoint;
    }

    private sortCars(): void {
        const maxSegmentsEncountered = this.kartsSegmentCrossed[3];
        for (let i = 0; i < 3; i++) {
            if (this.kartsSegmentCrossed[i] > maxSegmentsEncountered) {
                this.playerPosition++;
            } else if (this.kartsSegmentCrossed[i] === maxSegmentsEncountered) {
                this.sameSegmentAsPlayer.push(i);
            }
        }
    }

    private sameSegmentSort(): number {
        const minDistanceEncoutered = this.distance[INDEXES.CASETHREE];
        for (let i = 0; i < this.sameSegmentAsPlayer.length; i++) {
            if (this.distance[i] < minDistanceEncoutered) {
                this.playerPosition++;
            }
        }
        return this.playerPosition;
    }

    public reinitialize(): void {
        const size = 4;
        this.kartsSegmentCrossed = new Array<number>(size);
        this.distance = new Array<number>(size);
        this.playerPosition = INDEXES.CASEONE;
        this.sameSegmentAsPlayer = new Array<number>();
    }
}
