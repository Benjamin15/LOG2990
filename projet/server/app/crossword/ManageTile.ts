import { Tile } from './../../../commun/models/Tile';

export class  ManageTile {

    public static writeWordDown(tile: Tile, word: string): void {
        while (tile.hasTileUp() && !tile.tileUpIsBlock()) {
            tile = tile.tileUp;
        }
        let i = 0;
        while (tile !== undefined && !tile.isBlock()) {
            tile.value = word.toString().charAt(i++);
            tile = tile.tileDown;
        }
    }

    public static writeWordRight(tile: Tile, word: string): void {
        while (tile.hasTileLeft() && !tile.tileLeftIsBlock()) {
            tile = tile.tileLeft;
        }
        let i = 0;
        while (tile !== undefined && !tile.isBlock()) {
            tile.value = word.toString().charAt(i++);
            tile = tile.tileRight;
        }
    }

    public static getWordDown(tile: Tile): string {
        let tileDown = tile;
        let word = '';
        while (tileDown !== undefined && !tileDown.isBlock()) {
            if (tileDown.value === '.') {
                word += '?';
            } else {
                word += tileDown.value;
            }
            tileDown = tileDown.tileDown;
        }
        return word;
    }

    public static getWordUp(tile: Tile): string {
        let tileUp = tile;
        let word = '';
        let size = 0;
        while (tileUp.hasTileUp() && !tileUp.tileUpIsBlock()) {
            size++;
            tileUp = tileUp.tileUp;
        }
        for (let i = 0; i < size; i++) {
            if (tileUp.value === '.') {
                word += '?';
            } else {
                word += tileUp.value;
            }
            tileUp = tileUp.tileDown;
        }
        return word;
    }

    public static getWordLeft(tile: Tile): string {
        let tileLeft = tile;
        let word = '';
        let size = 0;
        while (tileLeft.hasTileLeft() && !tileLeft.tileLeftIsBlock()) {
            size++;
            tileLeft = tileLeft.tileLeft;
        }
        for (let i = 0; i < size; i++) {
            if (tileLeft.value === '.') {
                word += '?';
            } else {
                word += tileLeft.value;
            }
            tileLeft = tileLeft.tileRight;
        }
        return word;
    }

    public static getWordRight(tile: Tile): string {
        let tileRight = tile;
        let word = '';
        while (tileRight !== undefined && !tileRight.isBlock()) {
            if (tileRight.value === '.') {
                word += '?';
            } else {
                word += tileRight.value;
            }
            tileRight = tileRight.tileRight;
        }
        return word;
    }
}
