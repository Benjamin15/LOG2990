import { async, TestBed } from '@angular/core/testing';
import { AdminAuthenticationComponent } from './authentication.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { OrderByPipe } from '../../../Pipe';
import { AuthenticationService } from './authentication.service';

describe('AdminAuthenticationComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminAuthenticationComponent, OrderByPipe],
            imports: [FormsModule, HttpModule],
            providers: [AuthenticationService]
        }).compileComponents();
    }));

    it('should be created', () => {
        expect(true).toBeTruthy();
    });
});
