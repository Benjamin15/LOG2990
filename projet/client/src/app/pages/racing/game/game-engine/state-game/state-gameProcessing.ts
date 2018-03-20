import { Subject } from 'rxjs/Subject';
import { PlayerVirtual } from './../../players/player-virtual';
import { ManagerCarSort } from './../../car/race-cars-ranking/manage-cars-sort';
import { Snow } from './../../environment/particles/snow';
import { Particles } from './../../environment/particles/particles';
import { RendererRaceService } from './../../renderer/renderer.service';
import { ManagerCheckSense } from './../../car/manager-check-sense';
import { SingletonHeader } from './../../car/GUI/HUD/singleton-header';
import { StateGame } from './state-game';
import { Camera } from './../../camera/camera';
import { Timer } from './../../../../../../../../commun/services/Timer';
import { Rain } from '../../environment/particles/rain';

const RANDOM_COMPARATOR = 0.5;

export class StateGameProcessing extends StateGame {

    public maxTurnNumber: number;
    public racingPosition: number;
    public turnCounter: number;
    public circuitEnded: boolean;
    public hasAlreadyAccelerated: boolean;
    public timer: Timer;
    private managerCheckSens: ManagerCheckSense;
    private constantSpeed: NodeJS.Timer;
    private particlesManager: Particles;
    private manageCarSort: ManagerCarSort;

    constructor(stateGame: StateGame) {
        super(stateGame);
        this.racingPosition = 1;
        this.turnCounter = 1;
        this.circuitEnded = false;
        new SingletonHeader().instanceTotalTimer().launch();
        new SingletonHeader().instanceTimerLap().launch();
        this.playerVirtuals.forEach(player => {
            player.statistics.startTimer();
        });
        this.managerCheckSens = new ManagerCheckSense(this.player, this.roadManager, this.scene);
        this.camera = new Camera(this.player.car, this.scene);
        this.managerAudio.loadMusicRace();
        this.hasAlreadyAccelerated = false;
        this.timer = new Timer();
        this.manageCarSort = new ManagerCarSort(this.scene);
        if (Math.random() < RANDOM_COMPARATOR) {
            this.particlesManager = new Rain(this.scene);
        } else {
            this.particlesManager = new Snow(this.scene);
        }
    }

    public render(renderer: RendererRaceService): void {
        this.player.camera.render(this.scene, renderer);
        this.player.car.render();
        this.playerVirtuals.forEach(playerVirtual => {
            playerVirtual.car.render();
        });
    }

    public update(): void {
        this.managerCheckSens.checkSense();
        this.managerCheckSens.checkHalfway();
        this.countTurn();
        new SingletonHeader().instanceTotalTimer().update();
        new SingletonHeader().instanceTimerLap().update();
        new SingletonHeader().instanceLapCounter().update(this.turnCounter);
        new SingletonHeader().instanceLapMax().update(this.maxTurnNumber);
        const position = this.manageCarSort.getPlayerPosition();
        new SingletonHeader().instanceRacePosition().update(position);
        this.manageCarSort.reinitialize();
        this.player.update();
        this.manageEngineAudio();
        this.playerVirtuals.forEach(playerVirtual => {
            playerVirtual.update();
        });
        this.particlesManager.update();
    }

    public setTurnNumber(number: number): void {
        this.maxTurnNumber = number;
    }

    private countTurn(): void {
        if (this.managerCheckSens.getIsGoodWay()) {
            if (this.managerCheckSens.checkIfPlayerEnded() && this.managerCheckSens.halfway) {
                this.turnCounter++;
                new SingletonHeader().instanceTimerLap().saveLapTime(this.turnCounter);
                new SingletonHeader().instanceTimerLap().getTimer().startTimer();
                this.managerCheckSens.halfway = false;
                if (this.turnCounter === this.maxTurnNumber + 1) {
                    clearTimeout(this.constantSpeed);
                    this.carManagerAudio.carSound.stop();
                    this.turnCounter--;
                    this.showTimes();
                    this.circuitEnded = true;
                }
            }
        }
    }

    public endRace(): boolean {
        return this.circuitEnded;
    }

    private manageEngineAudio(): void {
        if (this.player.car.physicsMovement.isAccelerate) {
            this.manageAccelerationCar();
        } else {
            this.manageDeccelerationCar();
        }
    }

    private manageDeccelerationCar(): void {
        this.hasAlreadyAccelerated = false;
        const speed = 'no speed', decceleration = 'decceleration';
        if (this.player.car.physicsMovement.speed === 0) {
            this.carManagerAudio.play(speed);
        } else {
            this.carManagerAudio.play(decceleration);
        }
    }

    private manageAccelerationCar(): void {
        const acceleration = 'acceleration';
        if (!this.hasAlreadyAccelerated) {
            this.carManagerAudio.play(acceleration);
            clearTimeout(this.constantSpeed);
            this.manageSpeedCar();
            this.hasAlreadyAccelerated = true;
        }
    }

    private manageSpeedCar(): void {
        const speed = 'speed', time = 14000;
        this.constantSpeed = setTimeout(() => {
            if (this.hasAlreadyAccelerated) {
                this.carManagerAudio.play(speed);
            }
        }, time);
    }

    private showTimes(): void {
        this.playerVirtuals.forEach(player => {
            this.racesTimes.push(this.fillResultsIa(player));
        });
        this.racesTimes.push(this.fillPlayerResults());
        this.racesTimes.sort((firstArray, secondArray) => {
            return firstArray[1] > secondArray[1] ? 1 : firstArray[1] === secondArray[1] ? 0 : -1 ;
        });
    }

    private fillResultsIa(player: PlayerVirtual): Array<string> {
        const table = new Array<string>();
        table.push(player.car.name);
        if (!player.car.end) {
            table.push(player.statistics.TimeEllapsed());
            player.statistics.timeTurn.forEach(time => {
                table.push(time);
            });
        } else {
            table.push(player.statistics.getFinalTime());
            player.statistics.timeTurn.forEach(time => {
                table.push(time);
            });
        }
        return table;
    }

    private fillPlayerResults(): Array<string> {
        const table = new Array<string>();
        table.push(this.player.car.name);
        new SingletonHeader().instanceTotalTimer().getObservable().subscribe(time => {
            table.push(time);
        });
        new SingletonHeader().instanceTimerLap().getSavedLapTimesObservable().forEach((value: Subject<string>) => {
            value.asObservable().subscribe(time => {
                table.push(time);
            });
        });
        return table;
    }

}
