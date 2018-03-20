import { StateMovement } from './state-movement';
import {Car} from './../car';
export class StateMovementForwards implements StateMovement {

    public car: Car;

    constructor(car: Car) {
        this.car = car;
    }

    public render(speed: number): void {
        this.car.translateZ(-speed);
    }
}
