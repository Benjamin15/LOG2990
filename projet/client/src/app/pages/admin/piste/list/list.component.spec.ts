import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PisteListComponent } from './list.component';
import { HttpModule } from '@angular/http';
import { PisteSpecificationService } from './../piste-specification.service';
import { OrderByPipe } from './../../../../Pipe';
import { RouterModule } from '@angular/router';

describe('PisteListComponent', () => {
    let component: PisteListComponent;
    let fixture: ComponentFixture<PisteListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PisteListComponent, OrderByPipe],
            imports: [FormsModule, HttpModule, RouterModule],
            providers: [PisteSpecificationService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PisteListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
