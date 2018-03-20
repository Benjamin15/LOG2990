import { RendererRaceService } from './renderer.service';
import { TestBed, inject } from '@angular/core/testing';

describe('RendererService of the race ', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RendererRaceService]
        });
    });

    it('should be created', inject([RendererRaceService], (service: RendererRaceService) => {
        expect(service).toBeTruthy();
    }));
});
