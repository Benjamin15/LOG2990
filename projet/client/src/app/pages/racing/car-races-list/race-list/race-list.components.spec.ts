import { RaceListComponent } from './race-list.component';
import { assert } from 'chai';

describe('Race-List-Component', () => {

    const raceListComponent = new RaceListComponent(this.inject);

    it('should be created', () => {
        assert(raceListComponent);
    });
});
