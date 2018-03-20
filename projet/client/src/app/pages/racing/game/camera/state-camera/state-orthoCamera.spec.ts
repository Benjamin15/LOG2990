import { StateOrthographicCamera } from './state-orthoCamera';
import { TestBed, inject } from '@angular/core/testing';

describe('StateOrthographicCamera', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StateOrthographicCamera]
        });
    });

    it('should be created', inject([StateOrthographicCamera], (service: StateOrthographicCamera) => {
        expect(service).toBeTruthy();
    }));
});
