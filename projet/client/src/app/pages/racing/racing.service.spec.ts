import { RacingService } from './racing.service';
import { TestBed } from '@angular/core/testing';


describe('RacingService', () => {

    beforeEach((() => {
        TestBed.configureTestingModule({
            providers: [RacingService]
        }).compileComponents();

        it('should be created', () => {
            this.racingService = new RacingService(null);
            expect(this.racingService).toBeTruthy();
        });
    }));
});
