import { PhysicsSpeedBonus } from './physics-speedBonus';
import { SceneRaceService } from './../scene/scene.service';
import { Car } from './../car/car';
import { assert } from 'chai';

describe('Physics-SpeedBonus', () => {

    const scene = new SceneRaceService();
    const car = new Car(this.inject);
    const physicsSpeedBonus = new PhysicsSpeedBonus(scene, car);

    it('should be created', () => {
        assert(physicsSpeedBonus);
    });

    it('speed variable should increase after update', () => {
        let initialSpeed: number;
        initialSpeed = 1;
        let speedAfterUpdate: number;
        speedAfterUpdate = 1;
        physicsSpeedBonus.startSpeedBonus();

        speedAfterUpdate = physicsSpeedBonus.update(initialSpeed);
        assert(speedAfterUpdate > initialSpeed);
    });

    it('speed variable should decrease after update', () => {
        let initialSpeed: number;
        initialSpeed = 1;
        let speedAfterUpdate: number;
        speedAfterUpdate = 1;
        physicsSpeedBonus.startSpeedBonus();
        physicsSpeedBonus.timer.setStart(15);
        physicsSpeedBonus.timer.startTimer();

        speedAfterUpdate = physicsSpeedBonus.update(initialSpeed);
        assert(speedAfterUpdate < initialSpeed);
    });

    it('hasSpeedBonus variable should be false after update', () => {
        const initialSpeed = 1;
        physicsSpeedBonus.startSpeedBonus();
        physicsSpeedBonus.timer.setStart(15);
        physicsSpeedBonus.timer.startTimer();

        physicsSpeedBonus.update(initialSpeed);
        assert(physicsSpeedBonus.hasSpeedBonus === false);
    });

    it('hasSpeedBonus variable should be true after update', () => {
        const initialSpeed = 1;
        physicsSpeedBonus.startSpeedBonus();

        physicsSpeedBonus.update(initialSpeed);
        assert(physicsSpeedBonus.hasSpeedBonus === true);
    });
});
