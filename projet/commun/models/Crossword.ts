import { Tile } from './Tile';
import { Board } from './Board';

export class Crossword {
    public board: Board;
    public definitionsLine: Array<string>;
    public definitionsColumn: Array<string>;

    constructor(public mode: string, public difficulty: string) {
        this.board = new Board();
    }

    public copyCrossword(crossword: Crossword): void {
        this.definitionsColumn = crossword.definitionsColumn;
        this.definitionsLine = crossword.definitionsLine;
        this.board = new Board();
        for (let i = 0; i < crossword.board.tiles.length; i++) {
            for (let j = 0; j < crossword.board.tiles.length; j++) {
                this.board.tiles[i][j].copy(crossword.board.tiles[i][j]);
            }
        }
    }

    public correctTile(): void {
        const grill = new Array<Array<Tile>>();
        for (let i = 0; i < this.board.tiles.length; i++) {
            grill.push(new Array<Tile>());
            for (let j = 0; j < this.board.tiles[0].length; j++) {
                grill[i].push(new Tile(this.board.tiles[i][j].value.toUpperCase()));
            }
        }
        this.board.tiles = grill;
    }

    public clear(): void {
        this.board.tiles.forEach(tiles => {
            tiles.forEach(tile => {
                if (!tile.isBlock()) {
                    tile.clear();
                }
            });
        });
    }

    public disabledWord(word: string): void {
        this.disabledWordLine(word);
        this.disabledWordColumn(word);
    }

    private disabledWordColumn(word: string): void {
        let index = 0;
        for (let i = 0; i < this.board.tiles.length; i++) {
            for (let j = 0; j < this.board.tiles[0].length; j++) {
                if (word[index] === this.board.tiles[j][i].value) {
                    if (index === word.length - 1) {
                        while (index > -1) {
                            const pos = j - index--;
                            this.board.tiles[pos][i].disabled = true;
                        }
                    }
                    index++;
                } else {
                    index = 0;
                }
            }
        }
    }

    private disabledWordLine(word: string): void {
        let index = 0;
        for (let i = 0; i < this.board.tiles.length; i++) {
            for (let j = 0; j < this.board.tiles[0].length; j++) {
                if (word[index] === this.board.tiles[i][j].value) {
                    if (index === word.length - 1) {
                        while (index > -1) {
                            const pos = j - index--;
                            this.board.tiles[i][pos].disabled = true;
                        }
                    }
                    index++;
                } else {
                    index = 0;
                }
            }
        }
    }

    public addWord(word: string, crossword: Crossword): void {
        this.addWordColumn(word, crossword);
        this.addWordLine(word, crossword);
    }

    private addWordLine(word: string, crossword: Crossword): void {
        let index = 0;
        for (let i = 0; i < crossword.board.tiles.length; i++) {
            for (let j = 0; j < crossword.board.tiles[0].length; j++) {
                if (word[index] === crossword.board.tiles[i][j].value) {
                    if (index === word.length - 1) {
                        const arrayChar = word.split('').reverse();
                        while (index > -1) {
                            const pos = j - index;
                            this.board.tiles[i][pos].value = arrayChar[index--];
                        }
                    }
                    index++;
                } else {
                    index = 0;
                }
            }
        }
    }

    private addWordColumn(word: string, crossword: Crossword): void {
        let index = 0;
        for (let i = 0; i < crossword.board.tiles.length; i++) {
            for (let j = 0; j < crossword.board.tiles[0].length; j++) {
                if (word[index] === crossword.board.tiles[j][i].value) {
                    if (index === word.length - 1) {
                        const arrayChar = word.split('').reverse();                        
                        while (index > -1) {
                            const pos = j - index;
                            this.board.tiles[pos][i].value = arrayChar[index--];
                        }
                    }
                    index++;
                } else {
                    index = 0;
                }
            }
        }
    }
}
