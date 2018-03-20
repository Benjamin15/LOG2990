import { CarManagerAudio } from './../../audio/car-manager-audio';
import { SingletonAudio } from './../../audio/singleton-audio';
import { RendererRaceService } from './../../renderer/renderer.service';
import { ManagerAudio } from './../../audio/manager-audio';
import { PlayerVirtual } from './../../players/player-virtual';
import { Player } from './../../players/player';
import { SceneRaceService } from './../../scene/scene.service';
import { ManageSkybox } from './../../environment/manage-skybox';
import { Observable } from 'rxjs/Observable';
import { SceneImporterService } from './../../../../../race-editor/scene-importer.service';
import { Camera } from './../../camera/camera';
import { RoadManagerService } from './../../roadManagerService';
import { Subject } from 'rxjs/Subject';

const NIGHT_MODE = 'NightMode';
const DAY_MODE = 'DayMode';

export class StateGame {
    public managerSkybox: ManageSkybox;
    public scene: SceneRaceService;
    public roadManager: RoadManagerService;
    public player: Player;
    public playerVirtuals: Array<PlayerVirtual>;
    public managerAudio: ManagerAudio;
    public carManagerAudio: CarManagerAudio;
    public camera: Camera;
    public isLoading: boolean;
    public trackDots = new Array();
    public isUpdatingSybox: boolean;
    public racesTimes: Array<Array<string>>;

    protected showResults: Subject<boolean>;

    constructor(stateGame: StateGame, public sceneImporter?: SceneImporterService) {
        if (stateGame) {
            this.managerSkybox = stateGame.managerSkybox;
            this.scene = stateGame.scene;
            this.player = stateGame.player;
            this.playerVirtuals = stateGame.playerVirtuals;
            this.camera = stateGame.camera;
            this.managerAudio = new SingletonAudio().instanceAudio();
            this.carManagerAudio = new SingletonAudio().instanceCarAudio();
            this.isLoading = stateGame.isLoading;
            this.trackDots = stateGame.trackDots;
            this.sceneImporter = stateGame.sceneImporter;
            this.roadManager = stateGame.roadManager;
            this.player.copyRoads(this.roadManager);
            this.showResults = stateGame.showResults;
            this.racesTimes = stateGame.racesTimes;
            this.checkDayMode();
        } else {
            this.managerSkybox = new ManageSkybox();
            this.scene = new SceneRaceService();
            this.roadManager = new RoadManagerService();
            this.isUpdatingSybox = false;
            this.racesTimes = new Array<Array<string>>();
        }
    }

    public render(renderer: RendererRaceService): void {
        return;
    }

    public async initialize(name: string, sceneImporter: SceneImporterService, difficulty: string, turnNumber: number): Promise<void> {
        return;
    }

    public update(): void {
        return;
    }

    public async importScene(name: string, sceneImporter: SceneImporterService): Promise<void> {
        return;
    }

    public startGame(): boolean {
        return false;
    }

    public updateRaceEnded(): Observable<boolean> {
        this.showResults = new Subject<boolean>();
        return this.showResults.asObservable();
    }

    public checkDayMode(): void {
        if (this.scene.dayManager.getType() === DAY_MODE) {
            this.isUpdatingSybox = true;
        } else if (this.scene.dayManager.getType() === NIGHT_MODE) {
            this.isUpdatingSybox = true;
        }
    }

    public endRace(): boolean {
        return false;
    }

    public setTurnNumber(number: number): void {
        return;
    }

    public endEndingOfRace(): boolean {
        return false;
    }
}
