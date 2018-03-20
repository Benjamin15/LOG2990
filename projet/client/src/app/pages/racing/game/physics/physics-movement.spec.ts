import { PhysicsMovement } from './physics-movement';
import { SceneRaceService } from './../scene/scene.service';
import { Car } from './../car/car';
import { assert } from 'chai';

describe('Physics-movement', () => {

    const scene = new SceneRaceService();
    const car = new Car(this.inject);
    car.end = false;
    const physicsMovement = new PhysicsMovement(scene, car);

    it('should be created', () => {
        assert(physicsMovement);
    });

    it('speedInitial should equal speed after startAccelerate method is called', () => {
        physicsMovement.startAccelerate();
        assert(physicsMovement.speedInitial === physicsMovement.speed);
    });

    it('isAccelerate variable should be true after startAccelerate method is called', () => {
        physicsMovement.startAccelerate();
        assert(physicsMovement.isAccelerate === true);
    });

    it('speedInitial should equal speed after stopAccelerate method is called', () => {
        physicsMovement.stopAccelerate();
        assert(physicsMovement.speedInitial === physicsMovement.speed);
    });

    it('speed should equal zero after stopAccelerate method is called', () => {
        physicsMovement.stopAccelerate();
        assert(physicsMovement.speed === 0);
    });

    it('isAccelerate variable should be false after stopAccelerate method is called', () => {
        physicsMovement.stopAccelerate();
        assert(physicsMovement.isAccelerate === false);
    });

    it('isAccelerate variable should be false after stopCar method is called', () => {
        physicsMovement.stopCar();
        assert(physicsMovement.isAccelerate === false);
    });

    it('speed should equal zero after stopCar method is called', () => {
        physicsMovement.stopCar();
        assert(physicsMovement.speed === 0);
    });

    it('acceleration should equal zero after stopCar method is called', () => {
        physicsMovement.stopCar();
        assert(physicsMovement.acceleration === 0);
    });

    it('speed should equal half its orginial speed after reduceCarSpeed method is called', () => {
        physicsMovement.speed = 4;
        physicsMovement.reduceCarSpeed();
        assert(physicsMovement.speed === 2);
    });

    it('isAccelerate variable should be false after onPotholeRightWheel method is called', () => {
        physicsMovement.onPotholeRightWheel(car);
        assert(physicsMovement.isAccelerate === false);
    });

    it('speed should equal 0.11 after onPotholeRightWheel method is called', () => {
        physicsMovement.onPotholeRightWheel(car);
        assert(physicsMovement.speed === 0.11);
    });

    it('acceleration should equal 0.11 after onPotholeRightWheel method is called', () => {
        physicsMovement.onPotholeRightWheel(car);
        assert(physicsMovement.acceleration === 0.11);
    });

    it('car position in X axis should be greater than its initial X position after onPotholeRightWheel method is called', () => {
        const carInitialXPosition = car.position.x;
        physicsMovement.onPotholeRightWheel(car);
        assert(car.position.x > carInitialXPosition);
    });

    it('car position in Y axis should be smaller than its initial Y position after onPotholeRightWheel method is called', () => {
        const carInitialYPosition = car.position.y;
        physicsMovement.onPotholeRightWheel(car);
        assert(car.position.y < carInitialYPosition);
    });

    it('isAccelerate variable should be false after onPotholeLeftWheel method is called', () => {
        physicsMovement.onPotholeLeftWheel(car);
        assert(physicsMovement.isAccelerate === false);
    });

    it('speed should equal 0.11 after onPotholeLeftWheel method is called', () => {
        physicsMovement.onPotholeLeftWheel(car);
        assert(physicsMovement.speed === 0.11);
    });

    it('acceleration should equal 0.11 after onPotholeLeftWheel method is called', () => {
        physicsMovement.onPotholeLeftWheel(car);
        assert(physicsMovement.acceleration === 0.11);
    });

    it('car position in X axis should be smaller than its initial X position after onPotholeLeftWheel method is called', () => {
        const carInitialXPosition = car.position.x;
        physicsMovement.onPotholeLeftWheel(car);
        assert(car.position.x < carInitialXPosition);
    });

    it('car position in Y axis should be smaller than its initial Y position after onPotholeLeftWheel method is called', () => {
        const carInitialYPosition = car.position.y;
        physicsMovement.onPotholeLeftWheel(car);
        assert(car.position.y < carInitialYPosition);
    });
});
