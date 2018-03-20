import { PlayerVirtual } from './players/player-virtual';
import { Subject } from 'rxjs/Subject';
import { GameManager } from './game-manager';
import { SingletonHeader } from './car/GUI/HUD/singleton-header';
import { SingletonCountdown } from './car/GUI/HUD/singleton-countdown';
import { RacingService } from './../racing.service';
import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { StateGameProcessing } from './game-engine/state-game/state-gameProcessing';
import { Time } from '../../../../../../commun/models/Time';

const LOADING = 'LOADING';
const ROTATION_SPEED_X = 0.005;
const ROTATION_SPEED_Y = 0.01;
const TIME_START = '00:00:00';
const RACE_BEST_TIMES_LENGTH = 3;
const FIVE = 5;

@Component({
    selector: 'app-racing',
    templateUrl: './racing.component.html',
    styleUrls: ['./racing.component.scss'],
    providers: [GameManager]
})

export class RacingComponent implements AfterViewInit {

    @ViewChild('container') public containerRef: ElementRef;
    @Input() public rotationSpeedX = ROTATION_SPEED_X;
    @Input() public rotationSpeedY = ROTATION_SPEED_Y;
    public timeCount: string;
    public raceTime: string;
    public raceLapTime: string;
    public raceLapSavedTimes: Array<string>;
    public raceBestTimes: Array<Array<Time>>;
    public lapCount: number;
    public lapMax: number;
    public racePosition: number;
    public gameEnded: boolean;
    public appreciation: number;
    public raceResults: Array<Array<string>>;
    public isFinished: boolean;
    public playerName: string;
    public playerVirtual: Array<PlayerVirtual>;
    private name: string;

    constructor(private gameManager: GameManager, private route: ActivatedRoute,
        private racingService: RacingService) {
        this.raceTime = TIME_START;
        this.raceLapTime = TIME_START;
        this.raceLapSavedTimes = ['', '', ''];
        this.name = this.route.snapshot.params['name'];
        this.appreciation = 1;
        this.gameEnded = false;
        this.timeCount = LOADING;
        this.raceResults = new Array<Array<string>>();
        this.raceBestTimes = new Array<Array<Time>>(RACE_BEST_TIMES_LENGTH);
        this.isFinished = false;
        this.playerVirtual = new Array<PlayerVirtual>();
    }

    private getcontainer(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    public ngAfterViewInit(): void {
        const PARAMS = { TURN: 'turn', DIFFICULTY: 'difficulty', NAME: 'name', SIZE: 10 };
        this.route.paramMap
            .switchMap((params: ParamMap) => this.gameManager.initialize(this.getcontainer(), params.get(PARAMS.NAME),
                parseInt(params.get(PARAMS.TURN), PARAMS.SIZE), params.get(PARAMS.DIFFICULTY)))
            .subscribe(() => {
            });
        this.countdown();
        this.getTimer();
        this.getLapTimer();
        this.getLapSavedTimes();
        this.getLapCounter();
        this.getLapMax();
        this.getRacePosition();
        this.checkIfEnd();
    }

    @HostListener('window:keydown', ['$event'])
    public keyboardDownEventManager(event: KeyboardEvent): void {
        const state = this.gameManager.gameEngine.gameState;
        if (state instanceof StateGameProcessing) {
            this.gameManager.gameEngine.gameState.player.manageCommand.key.onKeyDown(event.keyCode);
        }
    }

    @HostListener('window:keyup', ['$event'])
    public keyboardUpEventManager(event: KeyboardEvent): void {
        const state = this.gameManager.gameEngine.gameState;
        if (state instanceof StateGameProcessing) {
            this.gameManager.gameEngine.gameState.player.manageCommand.key.onKeyUp(event.keyCode);
        }
    }

    public countdown(): void {
        new SingletonCountdown().instance().getObservable().subscribe(value => {
            this.timeCount = value;
        });
    }

    public getTimer(): void {
        new SingletonHeader().instanceTotalTimer().getObservable().subscribe(time => {
            this.raceTime = time;
        });
    }

    public getLapTimer(): void {
        new SingletonHeader().instanceTimerLap().getObservable().subscribe(time => {
            this.raceLapTime = time;

        });
    }

    public getLapSavedTimes(): void {
        let i = 0;
        new SingletonHeader().instanceTimerLap().getSavedLapTimesObservable().forEach((value: Subject<string>) => {
            value.asObservable().subscribe(time => {
                this.raceLapSavedTimes[i] = time;
                i++;
            });
        });
    }

    public getLapCounter(): void {
        new SingletonHeader().instanceLapCounter().getObservable().subscribe(result => {
            this.lapCount = result;
        });
    }

    public getLapMax(): void {
        new SingletonHeader().instanceLapMax().getObservable().subscribe(result => {
            this.lapMax = result;
        });
    }

    public getRacePosition(): void {
        new SingletonHeader().instanceRacePosition().getObservable().subscribe(result => {
            this.racePosition = result;
        });
    }

    public checkIfEnd(): void {
        this.gameManager.gameEngine.gameState.updateRaceEnded().subscribe(result => {
            this.gameEnded = result;
            if (this.gameEnded && !this.isFinished) {
                this.updateCircuitBestTimes();
                this.raceResults = this.gameManager.gameEngine.gameState.racesTimes;
                this.isFinished = true;
                this.playerVirtual = this.gameManager.gameEngine.gameState.playerVirtuals;
            }
        });
    }

    public sendAverage(average: number): void {
        this.racingService.sendAverage(this.name, average);
    }

    public async checkPlayerFinalPosition(): Promise<Array<Array<Time>>> {
        const ALERT = 'Congrats!!! You are in the the top 5 of best times. Please, enter your name';
        if (this.racePosition === 1) {
            const piste = await this.gameManager.sceneImporter.getCircuitByName(this.name);
            this.raceBestTimes = <Array<Array<Time>>>JSON.parse(piste.bestTimes);
            this.initializeRaceBestTimes(this.lapCount - 1, this.raceBestTimes);
            this.lapCount--;
            if (this.raceBestTimes[this.lapCount].length < FIVE) {
                this.playerName = window.prompt(ALERT);
            } else if (this.raceBestTimes[this.lapCount].length === FIVE) {
                if (this.raceTime < this.raceBestTimes[this.lapCount][this.raceBestTimes[this.lapCount].length - 1].time) {
                    this.playerName = window.prompt(ALERT);
                }
            }
            this.lapCount++;
            return this.raceBestTimes;
        }
    }

    public sendCircuitBestTimes(bestTimes: Array<Array<Time>>): void {
        const bestTimePlayer = new Time(this.raceTime, this.playerName);
        this.raceBestTimes = this.racingService.insertNewBestTime(bestTimes, bestTimePlayer, this.lapCount);
        this.racingService.sendCircuitBestTimes(this.name, this.raceBestTimes);
    }

    public async updateCircuitBestTimes(): Promise<void> {
        this.sendCircuitBestTimes(await this.checkPlayerFinalPosition());
    }

    public initializeRaceBestTimes(lap: number, bestTimes: Array<Array<Time>>): void {
        lap--;
        if (bestTimes === null || bestTimes === undefined) {
            this.raceBestTimes = new Array<Array<Time>>(RACE_BEST_TIMES_LENGTH);
            for (let i = 0; i < RACE_BEST_TIMES_LENGTH; i++) {
                this.raceBestTimes[i] = new Array<Time>();
            }
        } else if (bestTimes[lap] === null && bestTimes[lap] === undefined) {
            this.raceBestTimes[lap] = new Array<Time>();
        }
    }
}
