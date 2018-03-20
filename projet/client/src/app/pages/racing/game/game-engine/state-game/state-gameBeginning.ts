import { RendererRaceService } from './../../renderer/renderer.service';
import { SingletonCountdown } from './../../car/GUI/HUD/singleton-countdown';
import { StateGame } from './state-game';

export class StateGameBegin extends StateGame {
    public countdownOver;

    constructor (stateGame: StateGame) {
        super(stateGame);
        new SingletonCountdown().instance().launch(this.managerAudio);
    }

    public render(renderer: RendererRaceService): void {
        this.player.camera.render(this.scene, renderer);
        this.player.car.render();
    }


    public update(): void {
        this.countdownOver = new SingletonCountdown().instance().update();
    }

    public startGame(): boolean {
        return this.countdownOver;
    }
}
