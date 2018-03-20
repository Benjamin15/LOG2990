import { Player } from './../players/player';
import { Command } from './command';

export class CommandMovementForwardRight implements Command {

    public execute(player: Player): void {
        player.car.setMovementForwardRight();
    }
}
