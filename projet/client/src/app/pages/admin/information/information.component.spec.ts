import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { InformationComponent } from './information.component';
import { HttpModule } from '@angular/http';
import { UpdateInformationService } from './update-information.service';
import { NavbarAdminComponent } from './../../navbar/navbar-admin.component';

describe('InformationComponent', () => {
    let component: InformationComponent;
    let fixture: ComponentFixture<InformationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InformationComponent, NavbarAdminComponent],
            imports: [FormsModule, HttpModule],
            providers: [UpdateInformationService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
