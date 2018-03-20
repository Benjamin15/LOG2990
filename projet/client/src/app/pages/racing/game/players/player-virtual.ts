import { Ghost } from './../car/ghost';
import { StateMovementForwards } from './../car/state-movement/state-movement-forward';
import { ManagerDeplacementIa } from './manager-deplacement-ia';
import { RoadManagerService } from './../roadManagerService';
import { SceneRaceService } from './../scene/scene.service';
import { StatisticsIa } from './StatisticsIa';
import { Car } from './../car/car';

export class PlayerVirtual {

    public car: Car;
    public statistics: StatisticsIa;
    public canMove: boolean;
    public rank: number;

    private managerDeplacement: ManagerDeplacementIa;

    constructor(scene: SceneRaceService, roadManager: RoadManagerService,
                 name: string, difficulty: string,  turnNumber: number) {
        this.car = new Car(name, roadManager);
        this.car.stateMovement = new StateMovementForwards(this.car);
        this.managerDeplacement = new ManagerDeplacementIa(difficulty, this.car, roadManager);
        this.statistics = new StatisticsIa(turnNumber);
        this.canMove = true;
        this.rank = 0;
    }

    public update(): void {
        if (!this.car.end) {
            this.managerDeplacement.update();
            this.checkRaceEnded();
            this.checkTurn();
        }
    }

    public checkRaceEnded(): void {
        if (this.car.lapsManager.lapNumber > this.statistics.totalTurn) {
            this.car.end = true;
            Ghost.active(this.car);
            this.statistics.recordFinalTime();
        }
    }

    public checkTurn(): void {
        if (this.car.lapsManager.turncompleted) {
            this.statistics.recordLapTimes();
        }
    }
}
