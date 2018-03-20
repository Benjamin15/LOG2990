import { Player } from './../players/player';
import { Command } from './command';

export class CommandManageRetro implements Command {

    public execute(player: Player): void {
        if (player.camera.mirrorActivated === true) {
            player.camera.mirrorActivated = false;
        } else {
            player.camera.mirrorActivated = true;
        }
    }
}
