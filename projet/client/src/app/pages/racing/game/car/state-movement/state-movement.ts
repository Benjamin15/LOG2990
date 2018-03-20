import {Car} from './../car';
export interface StateMovement {

    car: Car;

    render(speed: number): void;
}
