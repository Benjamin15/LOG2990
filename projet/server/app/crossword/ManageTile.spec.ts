import { ManageTile } from './ManageTile';
import { assert } from 'chai';
import { Board } from '../../../commun/models/Board';

describe('manage tile', () => {
    const board = new Board();
    it('should tiles is creating', () => {
        board.tiles[0][0].value = 'A';
        board.tiles[0][1].value = 'B';
        board.tiles[0][2].value = 'C';
        board.tiles[0][3].value = 'D';
        board.tiles[1][0].value = 'E';
        board.tiles[1][1].value = 'F';
        board.tiles[1][2].value = 'G';
        board.tiles[1][3].value = 'H';
        board.tiles[2][0].value = 'W';
        board.tiles[2][1].value = 'J';
        board.tiles[2][2].value = 'K';
        board.tiles[2][3].value = 'L';
        assert(board.tiles.length === 10 && board.tiles[0].length === 10);
    }).timeout(1000);

    it ('should read right word', () => {
        assert(ManageTile.getWordRight(board.tiles[0][0]) === 'ABCD??????');
    });

    it ('should read left word', () => {
        assert(ManageTile.getWordLeft(board.tiles[1][3]) === 'EFG');
    });

    it ('should read down word', () => {
        assert(ManageTile.getWordDown(board.tiles[0][0]) === 'AEW???????');
    });

    it ('should read up word', () => {
        assert(ManageTile.getWordUp(board.tiles[2][2]) === 'CG');
    });

    it ('should write right : TEST ', () => {
        ManageTile.writeWordRight(board.tiles[0][0], 'TEST');
        assert(ManageTile.getWordRight(board.tiles[0][0]) === 'TEST');
    });

    it ('should write down : AGAIN', () => {
        ManageTile.writeWordDown(board.tiles[0][0], 'AGAIN');
        assert(ManageTile.getWordDown(board.tiles[0][0]) === 'AGAIN');
    });
});
