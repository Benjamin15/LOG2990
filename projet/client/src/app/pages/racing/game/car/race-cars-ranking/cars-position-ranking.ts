import { RoadManagerService } from './../../roadManagerService';
import { Car } from './../car';
import * as THREE from 'three';


const PROFESSIONAL = {
    DISTANCE: 90, TURN_FACTOR: 50, DECCELERATION: 0.0001, NAME: 'professionel'
};

export class ManagerCarPositionRanking {

    private actualCarPosition: number;
    public distanceToNextPoint: number;
    public segmentsCrossed: number;

    constructor(private car: Car,
        private roadManager: RoadManagerService) {
        this.actualCarPosition = 0;
        this.distanceToNextPoint = 0;
        this.segmentsCrossed = 0;
    }

    public update(): void {
        this.processCarDistanceFromPoint();
        this.updateNextPoint();
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

    private updateNextPoint(): void {
        if (this.distanceToNextPoint <= ((Math.random() * (PROFESSIONAL.DISTANCE)))) {
            this.adjustLaps();
        }
    }

    private adjustLaps(): void {
        if (this.actualCarPosition === (this.roadManager.checkPointsArray.length - 1)) {
            this.actualCarPosition = 0;
            this.segmentsCrossed ++;
        } else {
            this.actualCarPosition += 1;
            this.segmentsCrossed ++;
        }
    }
}
