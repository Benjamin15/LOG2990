import { SizeError, CancelError, TryError, BadEndError } from './../../../commun/models/Error';
import { ManageWord } from './ManageWord';
import { Crossword } from './../../../commun/models/Crossword';
import { Position } from './../../../commun/models/Position';
import { Tile } from './../../../commun/models/Tile';
import { ManageTile } from './ManageTile';
import { CheckGrill } from './CheckGrill';

const SIZE_ERROR = 2;
const LIMIT_TRY_ERROR = 1000;
const LIMIT_TRY_ERROR_WHILE = 50;

const CLEAR_TILE = '.';
export class GenerateWords {
    private startGrill: Crossword;
    private words: Array<string>;
    private grills: Array<Crossword>;
    private nTryTotal = 0;
    private isCancel: boolean;

    constructor(grill: Crossword) {
        this.words = new Array<string>();
        this.grills = new Array<Crossword>();
        this.grills.push(grill);
        this.isCancel = false;
    }

    private async initialize(): Promise<void> {
        this.isCancel = false;
        this.startGrill = new Crossword('', '');
        this.startGrill.copyCrossword(this.grills[0]);
        await ManageWord.loadWord(this.grills[this.grills.length - 1].difficulty);
    }

    private clear(): void {
        const crosswordClear = new Crossword('', '');
        crosswordClear.copyCrossword(this.startGrill);
        this.grills.push(crosswordClear);
    }

    public async createCrossword(crossword: Crossword): Promise<Crossword> {
        this.grills = new Array<Crossword>();
        this.grills.push(crossword);
        await this.initialize();
        this.generate();
        if (!this.isEnd()) {
            throw new BadEndError();
        }
        return this.grills[this.grills.length - 1];
    }

    private generate(): void {
        this.handleCancel();
        let succes = true;
        for (let i = 10; i > SIZE_ERROR && succes; i--) {
            succes = this.generateDown(i);
            if (succes) {
                succes = this.generateRight(i);
            }
        }
        if (!succes) {
            this.clear();
            this.generate();
        } else {
            this.validGenerate();
        }
    }

    private generateDown(sizeWanted: number): boolean {
        const position = new Position(0, 0);
        let succes = true;
        while (position.y < 10 && position.x < 9 && succes) {
            const tile = this.grills[this.grills.length - 1].board.tiles[position.x][position.y];
            const size = ManageTile.getWordDown(tile).length;
            if (size === SIZE_ERROR) {
                throw new SizeError();
            }
            if (tile.isBlock()) {
                position.x++;
            } else if (size === sizeWanted) {
                succes = this.checkWordDown(tile);
                position.x += size;
            } else {
                position.x += size;
            }
            if (position.x >= 8) {
                position.y++;
                position.x = 0;
            }
            this.handleCancel();
        }
        return succes;
    }

    private generateRight(sizeWanted: number): boolean {
        const position = new Position(0, 0);
        let succes = true;
        while (position.y < 9 && position.x < 10 && succes) {
            const tile = this.grills[this.grills.length - 1].board.tiles[position.x][position.y];
            const size = ManageTile.getWordRight(tile).length;
            if (size === SIZE_ERROR) {
                throw new SizeError ();
            }
            this.handleCancel();
            if (tile.isBlock()) {
                position.y++;
            } else if (size === sizeWanted) {
                succes = this.checkWordRight(tile);
                position.y += size;
            } else {
                position.y += size;
            }
            if (position.y >= 8) {
                position.x++;
                position.y = 0;
            }
        }
        return succes;
    }

    private checkWordDown(tile: Tile): boolean {
        let word = '';
        let succes = false;
        let nTry = 0;
        do {
            const fracWord = ManageTile.getWordUp(tile) + ManageTile.getWordDown(tile);
            word = ManageWord.getWordByLetterPosition(fracWord.toLowerCase());
            succes = this.validWordDown(tile, word);
            nTry++;
            if (word.length === SIZE_ERROR) {
                throw new SizeError();
            }
            if (this.nTryTotal++ > LIMIT_TRY_ERROR) {
                throw new TryError();
            }
            this.handleCancel();
            succes = (nTry >= LIMIT_TRY_ERROR_WHILE) ? true : succes;
        } while (!succes);
        this.writeWordDown(tile, word);
        return nTry < LIMIT_TRY_ERROR_WHILE;
    }

    private checkWordRight(tile: Tile): boolean {
        let word = '';
        let nTry = 0;
        let succes = true;
        do {
            const fracWord = ManageTile.getWordLeft(tile) + ManageTile.getWordRight(tile);
            word = ManageWord.getWordByLetterPosition(fracWord.toLowerCase());
            succes = this.validWordRight(tile, word);
            nTry++;
            if (word.length === SIZE_ERROR) {
                throw new SizeError();
            }
            if (this.nTryTotal++ > LIMIT_TRY_ERROR) {
                throw new TryError();
            }
            this.handleCancel();
            succes = (nTry >= LIMIT_TRY_ERROR_WHILE) ? true : succes;
        } while (!succes);
        this.writeWordRight(tile, word);
        return nTry < LIMIT_TRY_ERROR_WHILE;
    }

    private validWordDown(tileParam: Tile, word: string): boolean {
        let tile = tileParam;
        let succes = true;
        if (word === undefined) {
            return false;
        }
        for (let i = 0; i < word.length && succes; i++) {
            const wordRight = ManageTile.getWordRight(tile).substring(1);
            const wordPossible = ManageTile.getWordLeft(tile) + word[i] + wordRight;
            succes = ManageWord.isExistingWord(wordPossible);
            tile = tile.tileDown;
            this.handleCancel();
        }
        return succes;
    }


    private validWordRight(tileParam: Tile, word: string): boolean {
        let tile = tileParam;
        let succes = true;
        if (word === undefined) {
            return false;
        }
        for (let i = 0; i < word.length && succes; i++) {
            if (tile !== undefined) {
                const wordDown = ManageTile.getWordDown(tile).substring(1);
                const wordPossible = ManageTile.getWordUp(tile) + word[i] + wordDown;
                succes = ManageWord.isExistingWord(wordPossible);
                tile = tile.tileRight;
                this.handleCancel();
            }
        }
        succes = (this.words.indexOf(word) > -1) ? false : succes;
        return succes;
    }

    private writeWordDown(tile: Tile, word: string): void {
        if (word !== undefined) {
            ManageTile.writeWordDown(tile, word);
            this.words.push(word);
        }
    }

    private writeWordRight(tile: Tile, word: string): void {
        if (word !== undefined) {
            ManageTile.writeWordRight(tile, word);
            this.words.push(word);
        }
    }

    private validGenerate(): void {
        if (!CheckGrill.verifyGrill(this.grills[this.grills.length - 1])) {
            this.clear();
            this.generate();
        }
    }

    public cancel(): void {
        this.isCancel = true;
    }

    public handleCancel(): void {
        if (this.isCancel) {
            this.isCancel = false;
            throw new CancelError();
        }
    }

    private isEnd(): boolean {
        const grill = this.grills[this.grills.length - 1].board;
        grill.tiles.forEach( tiles => {
            tiles.forEach( tile => {
                if (tile.value === CLEAR_TILE) {
                    return false;
                }
            });
        });
        return true;
    }
}
