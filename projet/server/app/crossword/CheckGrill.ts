import { Position } from './../../../commun/models/Position';
import { ManageTile } from './ManageTile';
import { ManageWord } from './ManageWord';
import { Crossword} from './../../../commun/models/Crossword';

export class CheckGrill {

    private static verifyGrillColum(grill: Crossword): boolean {
        const position = new Position(0, 0);
        let succes = true;
        while (position.y < 10 && position.x < 10 && succes) {
            const tile = grill.board.tiles[position.x][position.y];
            if (!tile.isBlock()) {
                const word = ManageTile.getWordDown(tile);
                const sizeWord = word.length;
                if (sizeWord > 2) {
                    if (!(ManageWord.isExistingWord(word))) {
                        succes = false;
                    } else {
                        succes = (word.includes('?') || word.includes('.')) ? false : succes;
                    }
                }
                position.x += sizeWord;
            } else {
                position.x++;
            }
            if (position.x >= 8) {
                position.x = 0;
                position.y++;
            }
        }
        return succes;
    }

    private static verifyGrillLine(grill: Crossword): boolean {
        const position = new Position(0, 0);
        let succes = true;
        while (position.y < 10 && position.x < 10 && succes) {
            const tile = grill.board.tiles[position.x][position.y];
            if (!tile.isBlock()) {
                const word = ManageTile.getWordRight(tile);
                const sizeWord = word.length;
                if (sizeWord > 2) {
                    if (!(ManageWord.isExistingWord(word))) {
                        succes = false;
                    } else {
                        succes = (word.includes('?') || word.includes('.')) ? false : succes;
                    }
                }
                position.y += sizeWord;
            } else {
                position.y++;
            }
            if (position.y >= 8) {
                position.y = 0;
                position.x++;
            }
        }
        return succes;
    }

    public static verifyGrill(grill: Crossword): boolean {
        return (this.verifyGrillColum(grill)) && (this.verifyGrillLine(grill));
    }
}
