import { Definition } from './../../../../../../commun/models/Definition';
import { Crossword } from './../../../../../../commun/models/Crossword';
import { Position } from './../../../../../../commun/models/Position';
import { Board } from './../../../../../../commun/models/Board';

const HORIZONTAL = 'Horizontal';
const VERTICAL = 'Vertical';
const ASCII_A = 65;
const EMPTY = '';

export class InitGameService {

    public initLocalGrid(crossword: Crossword): Board {
        const localGrid = new Board();
        for (let i = 0; i < localGrid.tiles.length; i++) {
            for (let j = 0; j < localGrid.tiles.length; j++) {
                const tile = crossword.board.tiles[i][j];
                (tile.isBlock()) ? localGrid.tiles[i][j].disabledBlack() : localGrid.tiles[i][j].clearEmpty();
            }
        }
        return localGrid;
    }

    public initLocalHorizontal(crossword: Crossword): Array<Definition> {
        const localHorizontal = new Array<Definition>();
        let definitionNumber = 0;
        let lastIndex: string;

        for (let i = 0; i < crossword.board.tiles.length; i++) {
            let horizontal = new Definition();
            for (let j = 0; j < crossword.board.tiles.length; j++) {
                const tile = crossword.board.tiles[i][j];
                if (horizontal.positions.length === 0 && !tile.isBlock()) {
                    horizontal.index = this.charCode(i);
                }
                if (!tile.isBlock()) {
                    horizontal.positions.push(new Position(i, j));
                    horizontal.word += tile.value;
                }
                if ((tile.isBlock() || j === crossword.board.tiles.length - 1) && horizontal.word !== EMPTY) {
                    if (horizontal.word.length > 2) {
                        horizontal.definition = crossword.definitionsLine[definitionNumber];
                        horizontal.index += ((lastIndex === horizontal.index) ? '-2' : EMPTY);
                        horizontal.direction = HORIZONTAL;
                        localHorizontal.push(horizontal);
                        lastIndex = this.charCode(i);
                        definitionNumber++;
                    }
                    horizontal = new Definition();
                }
            }
        }
        return localHorizontal;
    }

    public initLocalVertical(crossword: Crossword): Array<Definition> {
        const localVertical = new Array<Definition>();
        let definitionNumber = 0;
        let lastIndex: string;
        for (let i = 0; i < crossword.board.tiles.length; i++) {
            let vertical = new Definition();
            for (let j = 0; j < crossword.board.tiles.length; j++) {
                const tile = crossword.board.tiles[j][i];
                if (vertical.positions.length === 0 && !tile.isBlock()) {
                    vertical.index = (i + 1).toString();
                }
                if (!tile.isBlock()) {
                    vertical.positions.push(new Position(j, i));
                    vertical.word += tile.value;
                }
                if ((tile.isBlock() || j === crossword.board.tiles.length - 1) && vertical.word !== EMPTY) {
                    if (vertical.word.length > 2) {
                        vertical.definition = crossword.definitionsColumn[definitionNumber];
                        vertical.index += ((lastIndex === vertical.index) ? '-2' : EMPTY);
                        vertical.direction = VERTICAL;
                        localVertical.push(vertical);
                        lastIndex = (i + 1).toString();
                        definitionNumber++;
                    }
                    vertical = new Definition();
                }
            }
        }
        return localVertical;
    }

    public loadGameGrill(): Board {
        const localGrid = new Board();
        for (let i = 0; i < localGrid.tiles.length; i++) {
            for (let j = 0; j < localGrid.tiles.length; j++) {
                localGrid.tiles[i][j].clearEmpty();
            }
        }

        localGrid.tiles[2][3].value = 'W';
        localGrid.tiles[2][4].value = 'A';
        localGrid.tiles[2][5].value = 'I';
        localGrid.tiles[2][6].value = 'T';
        localGrid.tiles[3][3].value = 'G';
        localGrid.tiles[3][4].value = 'A';
        localGrid.tiles[3][5].value = 'M';
        localGrid.tiles[3][6].value = 'E';

        return localGrid;
    }

    private charCode(index: number): string {
        return String.fromCharCode(ASCII_A + index);
    }
}
