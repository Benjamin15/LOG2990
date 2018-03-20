import { RoadManagerService } from './../roadManagerService';
import { SceneRaceService } from './../scene/scene.service';
import { ManagerCommand } from './../command/manager-command';
import { Camera } from './../camera/camera';
import { Car } from './../car/car';

const PLAYER = 'player';

export class Player {
    public manageCommand: ManagerCommand;
    public switchNightIsOn: boolean;
    public camera: Camera;
    public car: Car;

    constructor(public scene: SceneRaceService, roadManagerService: RoadManagerService) {
        this.manageCommand = new ManagerCommand();
        this.car = new Car(PLAYER, roadManagerService);
        this.camera = new Camera(this.car, scene);
        this.switchNightIsOn = false;
    }

    public copyRoads(roadManagerService: RoadManagerService): void {
        this.car.copyRoads(roadManagerService);
    }

    public update(): void {
        this.manageCommand.executeCommand(this);
        this.car.update();
        this.camera.update();
    }
}
