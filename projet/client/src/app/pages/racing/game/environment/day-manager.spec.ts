import { SceneRaceService } from './../scene/scene.service';
import { DayManager } from './day-manager';
import { assert } from 'chai';

describe('Day manager', () => {

    const scene = new SceneRaceService();
    const dayManager = new DayManager(scene);

    it('should be created', () => {
        assert(dayManager);
    });
});
