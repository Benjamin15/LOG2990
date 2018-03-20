import { IaGenerator } from './iaGenerator.service';
import { TestBed } from '@angular/core/testing';


describe('IaGenerator', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [IaGenerator]
        });
    });

    it('should be created', () => {
        this.iaGenerator = new IaGenerator();
        expect(this.iaGenerator).toBeTruthy();
    });

/*    it('table should be set', () => {

    });*/
});
