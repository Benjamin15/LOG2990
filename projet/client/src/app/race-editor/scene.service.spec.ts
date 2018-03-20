import { SceneService } from './scene.service';
import { TestBed, inject } from '@angular/core/testing';

describe('SceneService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SceneService]
        });
    });

    it('should be created', inject([SceneService], (service: SceneService) => {
        expect(service).toBeTruthy();
    }));
});
