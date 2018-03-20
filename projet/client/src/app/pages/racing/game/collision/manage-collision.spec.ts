import { PhysicsMovement } from './../physics/physics-movement';
import { SceneRaceService } from './../scene/scene.service';
import { Car } from './../car/car';
import * as THREE from 'three';
import { assert } from 'chai';
import { ManageCollision } from './../collision/manage-collision';

describe('manage-collision', () => {

    const scene = new SceneRaceService();
    const arrayCar = new Array<Car>();
    arrayCar.push(new Car('player', null));
    for (let i = 0; i < 3; i++) {
        arrayCar.push(new Car('playerVirtual' + i, null));
    }
    arrayCar.forEach(car => {
        car.physicsMovement = new PhysicsMovement(scene, car);
        const lamborgini = new THREE.Object3D();
        lamborgini.name = 'lamborghini';
        const mainBody = new THREE.Object3D();
        mainBody.name = 'MainBody';
        lamborgini.add(mainBody);
        car.add(lamborgini);
        scene.add(car);
        car.position.set(0, 0, 0);
        car.physicsMovement.speed = 0;
    });

    const manageCollision = new ManageCollision(scene, arrayCar[0]);

    it('should be created', () => {
        assert(manageCollision);
    });

    it('car should have been affected by the elastic collision after update method has been called', () => {
        manageCollision.update();
        assert(new THREE.Vector3(0, 0, 0) !== arrayCar[0].position);
    });

    it('car should not have moved after update method has been called because there is no collision', () => {
        arrayCar[0].position.set(1000, 1000, 1000);
        manageCollision.update();
        assert(arrayCar[0].physicsMovement.canStartTimer);
    });

});
