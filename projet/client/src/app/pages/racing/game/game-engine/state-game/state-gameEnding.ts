import { SingletonAudio } from './../../audio/singleton-audio';
import { RendererRaceService } from './../../renderer/renderer.service';
import { Timer } from './../../../../../../../../commun/services/Timer';
import { StateGame } from './state-game';

const CONVERT_TIME =  0.000005;
const POSITION_Y = 5;
const POSITION_X = 10;
const POSITION_Z = 60;
const FOV = 30;
const ZOOM = 10.5;
const SIN_FACTOR = 0.5;

export class StateGameEnd extends StateGame {

    public endingStateHasFinished;
    public cutsceneTimer: Timer;

    constructor(stateGame: StateGame) {
        super(stateGame);
        this.endingStateHasFinished = false;
        this.cutsceneTimer = new Timer();
        this.cutsceneTimer.startTimer();
        SingletonAudio.managerAudio.loadMusicEndRace();
    }

    public update(): void {
        this.updateCameraPosition();
    }

    public render(renderer: RendererRaceService): void {
        this.player.camera.render(this.scene, renderer);
        this.player.car.render();
    }

    public updateCameraPosition(): void {
        this.player.car.setMovementBreak();
        const theta = Date.now() * CONVERT_TIME;
        this.player.camera.cameraPerspective.position.y = POSITION_Y;
        this.player.camera.cameraPerspective.position.x = POSITION_X * Math.cos(theta);
        this.player.camera.cameraPerspective.position.z = POSITION_Z * Math.sin(theta);
        this.player.camera.cameraPerspective.lookAt(this.player.car.position);
        this.player.camera.cameraPerspective.fov = (FOV + POSITION_Y) + FOV * Math.sin(SIN_FACTOR * theta);
        this.player.camera.cameraPerspective.far = this.player.car.position.length();
        this.player.camera.cameraPerspective.zoom = ZOOM;
        this.endingStateHasFinished = true;
    }

    public endEndingOfRace(): boolean {
        return this.endingStateHasFinished;
    }
}
