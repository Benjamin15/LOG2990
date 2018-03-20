import { Player } from './../players/player';
import { Command } from './command';

export class CommandMovementForwardLeft implements Command {

    public execute(player: Player): void {
        player.car.setMovementForwardLeft();
    }
}
