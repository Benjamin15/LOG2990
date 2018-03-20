import { RendererService } from './renderer.service';
import { TestBed, inject } from '@angular/core/testing';

describe('RendererService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RendererService]
        });
    });

    it('should be created', inject([RendererService], (service: RendererService) => {
        expect(service).toBeTruthy();
    }));
});
