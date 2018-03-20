import { RoadManagerService } from './roadManagerService';
import { TestBed} from '@angular/core/testing';


describe('RacingService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RoadManagerService]
        });
    });

    it('should be created', () => {
        this.roadManager = new RoadManagerService();
        expect(this.roadManager).toBeTruthy();
    });
});
