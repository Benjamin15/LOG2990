import { Player } from './../players/player';
import { Command } from './command';

export class CommandZoomOut implements Command {

    public execute(player: Player): void {
        player.camera.zoomOut();
    }
}
