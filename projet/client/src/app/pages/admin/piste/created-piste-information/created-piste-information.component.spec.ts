import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatedPisteInformationComponent } from './created-piste-information.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { OrderByPipe } from './../../../../Pipe';
import { PisteListComponent } from './../list/list.component';
import { PisteSpecificationService } from './../piste-specification.service';
import { NavbarAdminComponent } from './../../../navbar/navbar-admin.component';
import { RouterModule } from '@angular/router';

describe('CreatedpistinformationComponent', () => {
    let component: CreatedPisteInformationComponent;
    let fixture: ComponentFixture<CreatedPisteInformationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreatedPisteInformationComponent, OrderByPipe, PisteListComponent, NavbarAdminComponent],
            imports: [FormsModule, HttpModule, RouterModule],
            providers: [PisteSpecificationService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreatedPisteInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

});
