import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidateWordService } from './../services/validate-word.service';
import { CrosswordComponent } from './../game/crossword.component';
import { CrosswordService } from './../services/crossword.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { InitGameService } from './../services/init-game.service';
import { MovementService } from './../services/movement.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

describe('CrosswordComponent', () => {
    let component: CrosswordComponent;
    let fixture: ComponentFixture<CrosswordComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrosswordComponent, NavbarComponent],
            imports: [FormsModule, HttpModule, RouterModule, BrowserAnimationsModule],
            providers: [CrosswordService, MovementService, ValidateWordService, InitGameService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
