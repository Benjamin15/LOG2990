import { Player } from './../players/player';
import { Command } from './command';

export class CommandSwitchNight implements Command {

    public execute(player: Player): void {
        player.scene.switchDayCycle(player);
    }
}
