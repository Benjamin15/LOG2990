import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardAdminComponent } from './dashboard.component';
import { NavbarAdminComponent } from '../../navbar/navbar-admin.component';
import { PisteListComponent } from '../piste/list/list.component';
import { OrderByPipe } from './../../../Pipe';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { PisteSpecificationService } from './../piste/piste-specification.service';
import { RouterModule } from '@angular/router';

describe('DashboardAdminComponent', () => {
    let component: DashboardAdminComponent;
    let fixture: ComponentFixture<DashboardAdminComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardAdminComponent, NavbarAdminComponent, PisteListComponent, OrderByPipe],
            imports: [FormsModule, HttpModule, RouterModule],
            providers: [PisteSpecificationService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
