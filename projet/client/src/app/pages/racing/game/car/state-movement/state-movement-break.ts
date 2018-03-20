import { StateMovement } from './state-movement';
import {Car} from './../car';
export class StateMovementBreak implements StateMovement {

    public car: Car;

    constructor(modelCar: Car) {
        this.car = modelCar;
    }

    public render(speed: number): void {
       this.car.translateZ(-speed);
    }
}
