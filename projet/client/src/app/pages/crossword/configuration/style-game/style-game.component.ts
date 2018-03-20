import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { CrosswordComponent } from './../../game/crossword.component';
import { routerTransition } from './../../../../animations';
import { CrosswordService } from './../../services/crossword.service';
import { IConfiguration } from './../IConfiguration';
import { Configuration } from './../../../../../../../commun/models/Configuration';

const SELECT = 'select';
const EMPTY = '';

@Component({
    selector: 'app-configuration',
    templateUrl: './style-game.component.html',
    styleUrls: ['./style-game.component.css'],
    animations: [routerTransition()],
})

export default class StyleGameComponent {
    @ViewChild('myElement') private element: ElementRef;
    public showNum = 0;
    public componentData = null;
    public configuration: Configuration;

    constructor(private injector: Injector, private crosswordService: CrosswordService) {
        this.showNum = this.injector.get('showNum');
        this.configuration = new Configuration(IConfiguration.nPlayer, SELECT, SELECT, EMPTY);
    }

    public createCrosswordComponent(): void {
        IConfiguration.difficulty = this.configuration.difficulty;
        IConfiguration.mode = this.configuration.mode;
        IConfiguration.namePlayer = this.configuration.namePlayer;

        if (this.configuration.namePlayer !== EMPTY && this.configuration.difficulty !== SELECT
            && this.configuration.mode !== SELECT) {
            this.crosswordService.createRoom(this.configuration);
            this.goToCrossword();
        }
    }

    private goToCrossword(): void {
        this.element.nativeElement.remove();
        this.componentData = {
            component: CrosswordComponent,
            inputs: { showNum: 7 }
        };
    }
}
