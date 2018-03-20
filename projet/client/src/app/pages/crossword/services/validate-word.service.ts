import { Player } from './../../../../../../commun/models/Player';
import { Injectable } from '@angular/core';
import { CrosswordService } from './crossword.service';
import { IConfiguration } from './../configuration/IConfiguration';
import { Definition } from './../../../../../../commun/models/Definition';
import { Crossword } from './../../../../../../commun/models/Crossword';
import { Board } from './../../../../../../commun/models/Board';

const HORIZONTAL = 'Horizontal';
const SPACE = ' ';
const EMPTY = '';

@Injectable()
export class ValidateWordService {

    private localHorizontal: Array<Definition>;
    private localVertical: Array<Definition>;
    private crossword: Crossword;
    private localGrid: Board;

    constructor(private crosswordService: CrosswordService) {
        this.getAdverseWordFind();
    }

    public initAttributs(horizontal: Array<Definition>, vertical: Array<Definition>, crossword: Crossword, grid: Board): void {
        this.localHorizontal = horizontal;
        this.localVertical = vertical;
        this.crossword = crossword;
        this.localGrid = grid;
    }

    public checkWord(i: number, j: number): void {
        this.checkWordHorizontal(i, j);
        this.checkWordVertical(i, j);
    }

    private checkWordHorizontal(i: number, j: number): void {
        let word = EMPTY;
        let countFind = 0;

        for (let index = 0; index < this.localGrid.tiles.length; index++) {
            const tile = this.localGrid.tiles[i][index];
            if (!tile.isBlock()) {
                const trueValue = this.crossword.board.tiles[i][index].value;
                word += (tile.value === trueValue) ? trueValue : SPACE;
                countFind += (tile.value === trueValue) ? 1 : 0;
            }
            if (index === this.localGrid.tiles.length - 1 || tile.isBlock()) {
                if (word.length >= 3 && countFind === word.length) {
                    const definition = this.localHorizontal.find(element => (element.word === word && !element.disabled));
                    this.valideWordClient(definition);
                }
                word = EMPTY;
                countFind = 0;
            }
        }
    }

    private checkWordVertical(i: number, j: number): void {
        let word = EMPTY;
        let countFind = 0;

        for (let index = 0; index < this.localGrid.tiles.length; index++) {
            const tile = this.localGrid.tiles[index][j];
            if (!tile.isBlock()) {
                const trueValue = this.crossword.board.tiles[index][j].value;
                word += (tile.value === trueValue) ? trueValue : SPACE;
                countFind += (tile.value === trueValue) ? 1 : 0;
            }
            if (index === this.localGrid.tiles.length - 1 || tile.isBlock()) {
                if (word.length >= 3 && countFind === word.length) {
                    const definition = this.localVertical.find(element => (element.word === word && !element.disabled));
                    this.valideWordClient(definition);
                }
                word = EMPTY;
                countFind = 0;
            }
        }
    }

    private valideWordClient(definition: Definition): void {
        if (undefined !== definition) {
            this.disabledDefinitionClient(definition);
            this.crosswordService.sendWordFind(definition);
        }
    }

    private disabledDefinitionClient(definition: Definition): void {
        definition.disabledClient();
        definition.positions.forEach(position => {
            this.localGrid.tiles[position.x][position.y].disabledClient();
        });
    }

    private valideWordOther(definition: Definition): void {
        definition.positions.forEach(position => {
            this.localGrid.tiles[position.x][position.y].disabledOther();
            this.localGrid.tiles[position.x][position.y].value = this.crossword.board.tiles[position.x][position.y].value;
        });

        if (HORIZONTAL === definition.direction) {
            const item = this.localHorizontal.find(element => element.word === definition.word);
            item.disabledOther();
        } else {
            const item = this.localVertical.find(element => element.word === definition.word);
            item.disabledOther();
        }
    }

    private getAdverseWordFind(): void {
        if (2 === IConfiguration.nPlayer) {
            this.crosswordService.getWordFind().subscribe((definition: Definition) => {
                this.valideWordOther(definition);
            });
        }
    }

    public recheckDefinitionClient(player: Player): void {
        player.wordsFind.forEach(word => {
            this.localHorizontal.forEach(wordDef => {
                if (wordDef.word === word) {
                    this.disabledDefinitionClient(wordDef);
                }
            });
            this.localVertical.forEach(wordDef => {
                if (wordDef.word === word) {
                    this.disabledDefinitionClient(wordDef);
                }
            });
        });
    }

    public recheckDefinitionOpponent(player: Player): void {
        player.wordsFind.forEach(word => {
            this.localHorizontal.forEach(wordDef => {
                if (wordDef.word === word) {
                    this.valideWordOther(wordDef);
                }
            });
            this.localVertical.forEach(wordDef => {
                if (wordDef.word === word) {
                    this.valideWordOther(wordDef);
                }
            });
        });
    }
}
