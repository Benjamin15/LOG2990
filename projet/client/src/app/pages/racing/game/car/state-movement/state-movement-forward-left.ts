import { StateMovement } from './state-movement';
import * as THREE from 'three';
import {Car} from './../car';
export class StateMovementForwardLeft implements StateMovement {

    public car: Car;

    constructor(car: Car) {
        this.car = car;
    }

    public render(speed: number): void {
        const rotateAngle = Math.PI / 2 * 0.05;
        this.car.translateZ(-speed);
        this.car.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
        if (speed === 0) {
            throw new Error('speed = 0');
        }
    }
}
