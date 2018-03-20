import { StateGame } from './state-game';
import { Timer } from './../../../../../../../../commun/services/Timer';
import * as THREE from 'three';

const ANGLE_DIVIDER = 18;

export class StateGameResults extends StateGame {
    public gameEnded = true;
    public timer: Timer;

    constructor(stateGame: StateGame) {
        super(stateGame);
        this.managerAudio.loadMusicResults();
    }

    public update(): void {
        this.updateShowRaceResults();
    }

    public updateShowRaceResults(): void {
        this.showResults.next(this.gameEnded);
    }

    public render(): void {
        const vector = new THREE.Vector3(0, 1, 0);
        this.player.camera.cameraPerspective.rotateOnAxis(vector, (Math.PI / ANGLE_DIVIDER));
    }
}
