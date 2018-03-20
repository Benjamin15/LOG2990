import { StatePerspectiveCamera } from './state-perspectiveCamera';
import { TestBed, inject } from '@angular/core/testing';

describe('StatePerspectiveCamera', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StatePerspectiveCamera]
        });
    });

    it('should be created', inject([StatePerspectiveCamera], (service: StatePerspectiveCamera) => {
        expect(service).toBeTruthy();
    }));
});

