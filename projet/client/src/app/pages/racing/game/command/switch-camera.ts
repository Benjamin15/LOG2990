import { Player } from './../players/player';
import { Command } from './command';

export class CommandSwitchCamera implements Command {

    public execute(player: Player): void {
        player.camera.switch(player.scene);
    }
}
