import { RendererRaceService } from './../renderer/renderer.service';
import { StateGameResults } from './state-game/state-gameResults';
import { SceneImporterService } from './../../../../race-editor/scene-importer.service';
import { StateGameProcessing } from './state-game/state-gameProcessing';
import { StateGameLoading } from './state-game/state-gameLoading';
import { StateGame } from './state-game/state-game';
import { StateGameEnd } from './state-game/state-gameEnding';
import { StateGameBegin } from './state-game/state-gameBeginning';

const NIGHT_SKYBOX = 'Night';
const DAY_SKYBOX = 'Day';
const NIGHT_MODE = 'NightMode';
const DAY_MODE = 'DayMode';
const TIME = 7000;
const STATE = {
    BEGIN: 'StateGameBegin', PROCESS: 'StateGameProcessing', END: 'StateGameEnd'
};

export class GameEngine {
    public rendererService: RendererRaceService;
    public circuitName: string;
    public turnNumber: number;
    public difficulty: string;
    public gameState: StateGame;


    constructor(renderer: RendererRaceService, name: string, sceneImporter: SceneImporterService,
        difficulty: string, turnNumber: number) {
        this.rendererService = renderer;
        this.circuitName = name;
        this.difficulty = difficulty;
        this.turnNumber = turnNumber;
        this.startGame(sceneImporter);
    }

    public render(): void {
        this.gameState.render(this.rendererService);
    }

    public update(): void {
        this.gameState.update();
        if (this.gameState.constructor.name === STATE.BEGIN && this.gameState.startGame()) {
            this.gameState = new StateGameProcessing(this.gameState);
            this.gameState.setTurnNumber(this.turnNumber);
        }
        if (this.gameState.constructor.name === STATE.PROCESS && this.gameState.endRace()) {
            this.gameState = new StateGameEnd(this.gameState);
        }
        if (this.gameState.constructor.name === STATE.END && this.gameState.endEndingOfRace()) {
            this.gameState = new StateGameResults(this.gameState);
        }

        if (this.gameState.isUpdatingSybox) {
            if (this.gameState.player.switchNightIsOn) {
                if (this.gameState.scene.dayManager.getType() === DAY_MODE) {
                    this.gameState.managerSkybox.generate(this.gameState.player.camera.cameraPerspective, DAY_SKYBOX);
                    this.gameState.player.camera.cameraOrthogonal.add(this.gameState.managerSkybox.skyboxMesh);
                } else if (this.gameState.scene.dayManager.getType() === NIGHT_MODE) {
                    this.gameState.managerSkybox.generate(this.gameState.player.camera.cameraPerspective, NIGHT_SKYBOX);
                    this.gameState.player.camera.cameraOrthogonal.add(this.gameState.managerSkybox.skyboxMesh);
                }
                this.gameState.player.switchNightIsOn = false;
            }
        }
    }

    private async startGame(sceneImporter: SceneImporterService): Promise<void> {
        this.gameState = new StateGameLoading(null);
        await this.gameState.initialize(this.circuitName, sceneImporter, this.difficulty, this.turnNumber);
        const actu = this;
        setTimeout(() => {
            actu.gameState = new StateGameBegin(this.gameState);
        }, TIME);
    }
}
