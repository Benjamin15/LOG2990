import { Player } from './../players/player';
import { Command } from './command';
import { Car } from './../car/car';

const PLAYER_VIRTUAL = 'playerVirtual';
const N_CAR = 3;

export class CommandSwitchHeadLights implements Command {

    public execute(player: Player): void {
        if (player.car.getLight().lightIsOn) {
            this.removeLights(player);
        } else {
            this.activeLights(player);
        }
    }

    public removeLights(player: Player): void {
        player.car.getLight().removeLights();
        for (let i = 0; i < N_CAR; i++) {
            const virtualCar = <Car>player.scene.getObjectByName(PLAYER_VIRTUAL + i);
            virtualCar.getLight().removeLights();
        }
    }

    public activeLights(player: Player): void {
        player.car.getLight().activateLights();
        for (let i = 0; i < N_CAR; i++) {
            const virtualCar = <Car>player.scene.getObjectByName(PLAYER_VIRTUAL + i);
            virtualCar.getLight().activateLights();
        }
    }
}
