import { SceneRaceService } from './../scene/scene.service';
import { Car } from './../car/car';
import { PhysicsAquaplaning } from './physics-aquaplaning';
import { assert } from 'chai';

describe('Physics-Aquaplaning', () => {

    const scene = new SceneRaceService();
    const car = new Car(this.inject);
    const physicsAquaplaning = new PhysicsAquaplaning(scene, car);

    it('should be created', () => {
        assert(physicsAquaplaning);
    });
});
