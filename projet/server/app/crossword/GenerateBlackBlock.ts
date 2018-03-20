import { Board } from './../../../commun/models/Board';

const BLACK_BLOCK = '#';
const LENGTH_MAX = 6;
const LENGTH_COLUMN = 10;
const LENGTH_MIN = 3;
const CLEAR_TILE = '.';
export class GenerateBlackBlock {

    constructor(private board: Board) { }

    public createBlackBlocks(): void {

        this.board.tiles.forEach(tiles => {
            tiles.forEach(tile => {
                tile.value = BLACK_BLOCK;
            });
        });
        this.createClearCase();
    }

    private createClearCase(): void {
        this.createLine();
        this.createColumn();
    }


    private createLine(): void {
        for (let nColumn = 0; nColumn < LENGTH_COLUMN; nColumn++) {
            const lengthRandom = Math.floor(Math.random() * (LENGTH_MAX - LENGTH_MIN) + LENGTH_MIN);
            const positionRandom = Math.floor(Math.random() * (LENGTH_COLUMN - lengthRandom));
            if (this.validWordSpaceLine(positionRandom, lengthRandom, nColumn)) {
                for (let nLine = positionRandom; nLine < lengthRandom + positionRandom; nLine++) {
                    const tile = this.board.tiles[nColumn][nLine];
                    tile.value = CLEAR_TILE;
                }
            } else {
                nColumn--;
            }
        }
    }

    private createColumn(): void {
        let positionRandom = Math.floor(Math.random() * (LENGTH_COLUMN - LENGTH_MAX));
        for (let nLine = 0; nLine < LENGTH_COLUMN; nLine++) {
            const lengthRandom = Math.floor(Math.random() * (LENGTH_MAX - LENGTH_MIN - 1) + LENGTH_MIN);
            for (let nColumn = positionRandom; nColumn < lengthRandom + positionRandom; nColumn++) {
                const tile = this.board.tiles[nColumn][nLine];
                tile.value = CLEAR_TILE;
            }
            if (positionRandom >= LENGTH_MAX) {
                positionRandom = Math.floor(Math.random() * (LENGTH_COLUMN - LENGTH_MAX));
            } else {
                positionRandom = LENGTH_MAX;
            }
        }
        this.correctColumn();
    }

    private correctColumn(): void {
        let succes = false;
        for (let i = 0; i < LENGTH_COLUMN; i++) {
            let size = 0;
            for (let j = 0; j < LENGTH_COLUMN; j++) {
                const tile = this.board.tiles[j][i];
                if (tile.isBlock()) {
                    if (size === 2) {
                        succes = true;
                        tile.tileUp.value = BLACK_BLOCK;
                    }
                    size = 0;
                } else {
                    size++;
                }
            }
        }
    }

    private validWordSpaceLine(positionRandom: number, lengthRandom: number, nColumn: number): boolean {
        for (let nLine = positionRandom; nLine < lengthRandom + positionRandom; nLine++) {
            const tile = this.board.tiles[nColumn][nLine];
            if (tile.tileUp !== undefined && tile.tileUp.tileLeft !== undefined) {
                if (tile.tileUp.tileLeft.value === CLEAR_TILE && nLine > positionRandom) {
                    return false;
                }
            }
        }
        return true;
    }
}
