import { Player } from './../players/player';
import { Command } from './command';

export class CommandZoomIn implements Command {

    public execute(player: Player): void {
        player.camera.zoomIn();
    }
}
