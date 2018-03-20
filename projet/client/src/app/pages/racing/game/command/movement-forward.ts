import { Player } from './../players/player';
import { Command } from './command';

export class CommandMovementForward implements Command {

    public execute(player: Player): void {
        player.car.setMovementForward();
        player.car.update();
    }
}
