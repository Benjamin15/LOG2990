import { GenerateWords } from './GenerateWord';
import { expect } from 'chai';
import { Crossword } from '../../../commun/models/Crossword';

const BLACK_BLOCK = '#';
describe('generate grill', () => {
    it('should grill is create', done => {
        const crossword = new Crossword('Classical', 'Easy');
        createBlackBlock(crossword);
        const generateWords = new GenerateWords(crossword);
        generateWords.createCrossword(crossword).then( () => {
            expect(crossword.board.tiles.length === 10 && crossword.board.tiles[0].length === 10);
            done();
        });
    }).timeout(60000);
});

function createBlackBlock(crossword: Crossword) {
    crossword.board.tiles[0][5].value = BLACK_BLOCK;
    crossword.board.tiles[0][6].value = BLACK_BLOCK;
    crossword.board.tiles[0][8].value = BLACK_BLOCK;
    crossword.board.tiles[0][9].value = BLACK_BLOCK;
    crossword.board.tiles[1][1].value = BLACK_BLOCK;
    crossword.board.tiles[1][2].value = BLACK_BLOCK;
    crossword.board.tiles[1][3].value = BLACK_BLOCK;
    crossword.board.tiles[1][5].value = BLACK_BLOCK;
    crossword.board.tiles[1][6].value = BLACK_BLOCK;
    crossword.board.tiles[2][5].value = BLACK_BLOCK;
    crossword.board.tiles[2][6].value = BLACK_BLOCK;
    crossword.board.tiles[2][8].value = BLACK_BLOCK;
    crossword.board.tiles[3][1].value = BLACK_BLOCK;
    crossword.board.tiles[3][3].value = BLACK_BLOCK;
    crossword.board.tiles[3][4].value = BLACK_BLOCK;
    crossword.board.tiles[3][8].value = BLACK_BLOCK;
    crossword.board.tiles[4][0].value = BLACK_BLOCK;
    crossword.board.tiles[4][1].value = BLACK_BLOCK;
    crossword.board.tiles[4][3].value = BLACK_BLOCK;
    crossword.board.tiles[4][4].value = BLACK_BLOCK;
    crossword.board.tiles[4][6].value = BLACK_BLOCK;
    crossword.board.tiles[5][4].value = BLACK_BLOCK;
    crossword.board.tiles[5][6].value = BLACK_BLOCK;
    crossword.board.tiles[5][8].value = BLACK_BLOCK;
    crossword.board.tiles[5][9].value = BLACK_BLOCK;
    crossword.board.tiles[6][0].value = BLACK_BLOCK;
    crossword.board.tiles[6][2].value = BLACK_BLOCK;
    crossword.board.tiles[6][4].value = BLACK_BLOCK;
    crossword.board.tiles[6][6].value = BLACK_BLOCK;
    crossword.board.tiles[7][0].value = BLACK_BLOCK;
    crossword.board.tiles[7][2].value = BLACK_BLOCK;
    crossword.board.tiles[7][7].value = BLACK_BLOCK;
    crossword.board.tiles[7][9].value = BLACK_BLOCK;
    crossword.board.tiles[8][3].value = BLACK_BLOCK;
    crossword.board.tiles[8][4].value = BLACK_BLOCK;
    crossword.board.tiles[8][5].value = BLACK_BLOCK;
    crossword.board.tiles[8][7].value = BLACK_BLOCK;
    crossword.board.tiles[8][9].value = BLACK_BLOCK;
    crossword.board.tiles[9][0].value = BLACK_BLOCK;
    crossword.board.tiles[9][2].value = BLACK_BLOCK;
    crossword.board.tiles[9][3].value = BLACK_BLOCK;
    crossword.board.tiles[9][7].value = BLACK_BLOCK;
    crossword.board.tiles[9][9].value = BLACK_BLOCK;
}
