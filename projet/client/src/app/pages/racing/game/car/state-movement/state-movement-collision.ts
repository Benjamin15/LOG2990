import { StateMovement } from './state-movement';
import * as THREE from 'three';
import { Car } from './../car';

const MULTIPLY_SPEED = 6;
const DIRECTION_START = new THREE.Vector3(0, 0, 1);
export class StateMovementCollision implements StateMovement {

    constructor(public car: Car, private carCollider: Car) {
        this.car.physicsMovement.speed = carCollider.physicsMovement.speed;
    }

    public render(speed: number): void {
        const directionCar = DIRECTION_START.applyQuaternion(this.car.quaternion);
        const direction = directionCar.applyQuaternion( this.carCollider.quaternion );
        this.car.translateOnAxis(direction, this.car.physicsMovement.speed * MULTIPLY_SPEED);
        if (this.car.physicsMovement.speed === 0) {
            throw new Error('speed = 0');
        }
    }
}
