import { Tile } from './Tile';

export class Board {
    public tiles: Array<Array<Tile>>;
    private height = 10;
    private length = 10;

    constructor() {
        this.tiles = new Array<Array<Tile>>();
        this.generateTiles();
        this.linkTiles();
    }

    private generateTiles(): void {
        for (let i = 0; i < this.length; i++) {
            this.tiles.push(new Array<Tile>());
            for (let j = 0; j < this.height; j++) {
                this.tiles[i].push(new Tile('.'));
            }
        }
    }

    private linkTiles(): void {
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this.height; j++) {
                this.linkAvailable(i, j);
            }
        }
    }

    private linkAvailable(line: number, column: number): void {
        if (this.checkUpTile(line)) {
            this.tiles[line][column].tileUp = this.tiles[line - 1][column];
        }
        if (this.checkDownTile(line)) {
            this.tiles[line][column].tileDown = this.tiles[line + 1][column];
        }
        if (this.checkLeftTile(column)) {
            this.tiles[line][column].tileLeft = this.tiles[line][column - 1];
        }
        if (this.checkRightTile(column)) {
            this.tiles[line][column].tileRight = this.tiles[line][column + 1];
        }
    }

    private checkUpTile(line: number): boolean {
        let succes = true;
        if (line === 0) {
            succes = false;
        }
        return succes;
    }

    private checkDownTile(line: number): boolean {
        let succes = true;
        if (line === 9) {
            succes = false;
        }
        return succes;
    }

    private checkLeftTile(column: number): boolean {
        let succes = true;
        if (column === 0) {
            succes = false;
        }
        return succes;
    }

    private checkRightTile(column: number): boolean {
        let succes = true;
        if (column === 9) {
            succes = false;
        }
        return succes;
    }

    public display(): void {
        let nbCharacter = 0;
        let display = '';
        this.tiles.forEach(element => {
            element.forEach(tile => {
                if (nbCharacter === 0) {
                    display += '[';
                }
                display += ' ' + tile.value;
                if (nbCharacter === 9) {
                    display += ']\n';
                    nbCharacter = 0;

                } else {
                    nbCharacter++;
                }
            });
        });
        console.log(display);
    }

    public clear(): void{
        this.tiles.forEach(tiles => {
            tiles.forEach(tile => {
                if (!tile.isBlock()) {
                    tile.clear();
                }
            });
        });
    }
}