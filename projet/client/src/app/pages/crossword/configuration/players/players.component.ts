import { Component } from '@angular/core';
import { routerTransition } from '../../../../animations';
import { IConfiguration } from './../IConfiguration';
import JoinCreateGameComponent from './../join-create-game/join-create-game.component';
import StyleGameComponent from './../style-game/style-game.component';

@Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.css'],
    animations: [routerTransition()],
})

export class PlayersComponent {
    public componentData = null;

    public createJoinCreateComponent(): void {
        IConfiguration.nPlayer = 2;
        this.componentData = {
            component: JoinCreateGameComponent,
            inputs: { showNum: 2 }
        };
    }

    public createStyleGameComponent(): void {
        IConfiguration.nPlayer = 1;
        this.componentData = {
            component: StyleGameComponent,
            inputs: { showNum: 1 }
        };
    }
}
