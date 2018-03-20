import { Player } from './../players/player';
import { SceneRaceService } from './../scene/scene.service';
import { NightMode } from './day-state/night-mode';
import { DayCycle } from './day-state/day-cycle';
import { DayMode } from './day-state/day-mode';
import { Car } from './../car/car';

const NIGHT_MODE = 'NightMode';
const DAY_MODE = 'DayMode';
const PLAYER_VIRTUAL = 'playerVirtual';
const N_CAR = 3;

export class DayManager {

    private dayCycle: DayCycle;

    constructor(private scene: SceneRaceService) {
        this.dayCycle = new NightMode(scene);
    }

    public getType(): string {
        return this.dayCycle.type;
    }

    public switchMode(player: Player): void {
        if (this.dayCycle.type === DAY_MODE) {
            this.dayCycle.type = NIGHT_MODE;
            this.scene.remove(this.dayCycle.directionalLight);
            this.dayCycle = new NightMode(this.scene);
            player.car.getLight().activateLights();
            for (let i = 0; i < N_CAR; i++) {
                const virtualCar = <Car> player.scene.getObjectByName(PLAYER_VIRTUAL + i);
                virtualCar.getLight().activateLights();
            }
        } else {
            this.dayCycle.type = DAY_MODE;
            this.scene.remove(this.dayCycle.directionalLight);
            this.dayCycle = new DayMode(this.scene);
            player.car.getLight().removeLights();
            for (let i = 0; i < N_CAR; i++) {
                const virtualCar = <Car> player.scene.getObjectByName(PLAYER_VIRTUAL + i);
                virtualCar.getLight().removeLights();
            }
        }
    }
}
