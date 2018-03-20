import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ValidateWordService } from './../services/validate-word.service';
import { CrosswordService } from './../services/crossword.service';
import { routerTransition } from './../../../animations';
import { InitGameService } from './../services/init-game.service';
import { MovementService } from './../services/movement.service';
import { IConfiguration } from './../configuration/IConfiguration';
import { Configuration } from './../../../../../../commun/models/Configuration';
import { Definition } from './../../../../../../commun/models/Definition';
import { Crossword } from './../../../../../../commun/models/Crossword';
import { Position } from './../../../../../../commun/models/Position';
import { Player } from './../../../../../../commun/models/Player';
import { Board } from './../../../../../../commun/models/Board';

const BACKSPACE = 'Backspace';
const RIGHT = 'ArrowRight';
const LEFT = 'ArrowLeft';
const DOWN = 'ArrowDown';
const UP = 'ArrowUp';
const DYNAMIC = 'Dynamic';
const ASCII_A = 65;
const ASCII_Z = 90;

@Component({
    selector: 'app-crossword',
    templateUrl: './crossword.component.html',
    styleUrls: ['./crossword.component.css'],
    providers: [ValidateWordService, MovementService, InitGameService],
    animations: [routerTransition()]
})

export class CrosswordComponent implements OnInit {
    public cheatDefinition: boolean;
    public localHorizontal: Array<Definition>;
    public localVertical: Array<Definition>;
    public players: Array<Player>;
    public localGrid: Board;
    public newTime: number;
    public modal: string;
    public timer: number;

    @ViewChild('btnEnd') private btnEnd: ElementRef;
    @ViewChildren('cells') private cells: QueryList<ElementRef>;
    private normalDirection: boolean;
    private countCrossword: number;
    private configuration: Configuration;
    private wordSelect: Array<Position>;
    private crossword: Crossword;

    constructor(private crosswordService: CrosswordService, private validateWordService: ValidateWordService,
        private initGameService: InitGameService, private movementService: MovementService) {
        this.wordSelect = Array<Position>();
        this.cheatDefinition = false;
        this.normalDirection = true;
        this.countCrossword = 0;
    }

    public async ngOnInit() {
        this.configuration = new Configuration(IConfiguration.nPlayer, IConfiguration.difficulty,
            IConfiguration.mode, IConfiguration.namePlayer);
        this.localGrid = this.initGameService.loadGameGrill();
        this.initGame();
        this.getTimer();
        this.getPlayers();
        this.getEndGame();
        if (2 === this.configuration.nPlayer) {
            this.getSelectionAdverse();
        }
    }

    private initGame(): void {
        this.crosswordService.startGame().subscribe(crossword => {
            this.crossword = crossword;
            if (null != crossword) {
                this.initialization();
            }
        });
    }

    private initialization(): void {
        this.localHorizontal = this.initGameService.initLocalHorizontal(this.crossword);
        this.localVertical = this.initGameService.initLocalVertical(this.crossword);
        if (this.countCrossword++ < 1) {
            this.localGrid = this.initGameService.initLocalGrid(this.crossword);
            this.validateWordService.initAttributs(this.localHorizontal, this.localVertical, this.crossword, this.localGrid);
            this.movementService.initAttributs(this.localGrid, this.cells);
        } else {
            this.validateWordService.initAttributs(this.localHorizontal, this.localVertical, this.crossword, this.localGrid);
            this.movementService.initAttributs(this.localGrid, this.cells);
            this.validateWordService.recheckDefinitionClient(this.players[0]);
            if (this.players.length > 1) {
                this.validateWordService.recheckDefinitionOpponent(this.players[1]);
            }
        }
    }

    private getPlayers(): void {
        this.crosswordService.getPlayers().subscribe(players => {
            this.players = players;
        });
    }

    private getEndGame(): void {
        this.crosswordService.endGame().subscribe(endGame => {
            if (endGame) {
                if (this.configuration.nPlayer > 1) {
                    if (this.players[0].score === this.players[1].score) {
                        this.modal = 'egal';
                    } else if (this.players[0].score > this.players[1].score) {
                        this.modal = 'win';
                    } else {
                        this.modal = 'lose';
                    }
                    this.btnEnd.nativeElement.click();
                } else {
                    this.modal = 'win';
                    this.btnEnd.nativeElement.click();
                }
            }
        });
    }

    public resetGame(): void {
        this.countCrossword = 0;
        this.crosswordService.resetGame();
    }

    private getTimer(): void {
        if (this.configuration.mode === DYNAMIC) {
            this.crosswordService.getTimer().subscribe(timer => {
                this.timer = timer;
            });
        }
    }

    public setTimer(newTime: number): void {
        if (this.configuration.mode === DYNAMIC) {
            this.crosswordService.setTimer(newTime);
        }
    }

    public keyboardEvent(event: KeyboardEvent, i: number, j: number): boolean {
        let mouvement = event.key;
        const keyCode = (window.event ? event.keyCode : event.which);
        const tile = this.localGrid.tiles[i][j];
        if (undefined !== this.crossword) {
            if (keyCode >= ASCII_A && keyCode <= ASCII_Z) {
                tile.value = event.key.toUpperCase();
                mouvement = ((this.normalDirection) ? RIGHT : DOWN);
                this.validateWordService.checkWord(i, j);
            } else if (mouvement === BACKSPACE) {
                if (tile.value !== '') {
                    tile.clearEmpty();
                } else {
                    mouvement = ((this.normalDirection) ? LEFT : UP);
                }
            }
            this.movementService.keyboardMovement(mouvement, i, j);
        }
        return false;
    }

    public getSelection(positions: Array<Position>, normalDirection: boolean): void {
        this.normalDirection = normalDirection;
        this.getFocus(positions[0].x, positions[0].y);
        if (positions !== this.wordSelect) {
            this.crosswordService.sendPosition(positions);
            this.wordSelect.forEach(position => {
                this.localGrid.tiles[position.x][position.y].cursorNoneClient();
            });
            positions.forEach(position => {
                this.localGrid.tiles[position.x][position.y].cursorClient();
            });
            this.wordSelect = positions;
        }
    }

    private getFocus(i: number, j: number): void {
        const tile = this.localGrid.tiles[i][j];
        if ((tile.isBlock() || tile.disabled) && this.normalDirection) {
            this.movementService.goBlockRight(i, j);
        } else if ((tile.isBlock() || tile.disabled) && !this.normalDirection) {
            this.movementService.goBlockDown(i, j);
        } else {
            this.movementService.focus(i, j);
        }
    }

    private getSelectionAdverse(): void {
        let oldSelection = new Array<Position>();
        this.crosswordService.getAdversePosition().subscribe((selectionAdverse: Array<Position>) => {
            if (oldSelection !== selectionAdverse) {
                oldSelection.forEach(position => {
                    this.localGrid.tiles[position.x][position.y].cursorNoneOther();
                });
                selectionAdverse.forEach(position => {
                    this.localGrid.tiles[position.x][position.y].cursorOther();
                });
                oldSelection = selectionAdverse;
            }
        });
    }

    public charCode(index: number): string {
        return String.fromCharCode(ASCII_A + index);
    }
}
