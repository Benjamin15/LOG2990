import { Player } from './../players/player';
export interface Command {

    execute(player: Player): void;
}
