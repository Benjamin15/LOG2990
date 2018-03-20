import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { CrosswordComponent } from './../../game/crossword.component';
import { CrosswordService } from './../../services/crossword.service';
import { routerTransition } from './../../../../animations';
import { IConfiguration } from './../IConfiguration';
import { Configuration } from './../../../../../../../commun/models/Configuration';
import StyleGameComponent from './../style-game/style-game.component';

const ONE = 1;
const EMPTY = '';

@Component({
    selector: 'app-join-create-game',
    templateUrl: './join-create-game.component.html',
    styleUrls: ['./join-create-game.component.css'],
    animations: [routerTransition()]
})

export default class JoinCreateGameComponent {
    @ViewChild('myElement') private element: ElementRef;
    public showNum = 0;
    public componentData = null;
    public listRoom: Array<Configuration>;
    public namePlayer: string;
    public orderBy: string;
    public myRoom: Configuration;
    public one: number;

    constructor(private injector: Injector, private crosswordService: CrosswordService) {
        this.showNum = this.injector.get('showNum');
        this.getListRoom();
        this.myRoom = new Configuration(null, EMPTY, EMPTY, EMPTY);
        this.namePlayer = EMPTY;
        this.orderBy = 'roomId';
        this.one = ONE;
    }

    private getListRoom(): void {
        this.listRoom = new Array<Configuration>();
        this.crosswordService.getListRoom().subscribe(list => {
            if (ONE === list.length) {
                this.listRoom.push(list[0]);
            } else {
                this.listRoom = list;
            }
        });
    }

    public sortTable(orderBy: string): void {
        this.one = (orderBy === this.orderBy) ? -this.one : ONE;

        this.listRoom.sort((obj1: Configuration, obj2: Configuration) => {
            const a = obj1[orderBy];
            const b = obj2[orderBy];
            if (a < b) {
                return - this.one;
            } else if (a > b) {
                return this.one;
            } else { return 0; }
        });
        this.orderBy = orderBy;
    }

    public initMyRoom(room: Configuration): void {
        this.myRoom = room;
    }

    public joinGame(room: Configuration): void {
        if (EMPTY !== this.namePlayer) {
            IConfiguration.mode = room.mode;
            IConfiguration.roomID = room.roomId;
            IConfiguration.difficulty = room.difficulty;
            IConfiguration.namePlayer = this.namePlayer;

            this.crosswordService.joinRoom(room.roomId, this.namePlayer);
            this.element.nativeElement.remove();
            this.componentData = {
                component: CrosswordComponent,
                inputs: { showNum: 7 }
            };
        }
    }

    public createStyleGameComponent(): void {
        this.element.nativeElement.remove();
        this.componentData = {
            component: StyleGameComponent,
            inputs: { showNum: 1 }
        };
    }
}
