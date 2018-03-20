import { ManageCarCreation } from './GUI/manage-car-creation';
import { Car } from './car';
export class Ghost {

    public static active(car: Car): void {
        car.end = true;
        const manageCarCreation = new ManageCarCreation();
        manageCarCreation.setOpacity(car, 0.1);
    }
}
