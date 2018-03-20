import { GenerateBlackBlock } from './GenerateBlackBlock';
import { assert } from 'chai';
import { Board } from './../../../commun/models/Board';
describe('GenerateBlackBlock', () => {

    it('should insert black blocks into the grid', () => {
        const board = new Board();
        const blackBlocks = new GenerateBlackBlock(board);
        blackBlocks.createBlackBlocks();
        let success = false;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (board.tiles[i][j].value === '#') {
                    success = true;
                }
            }
        }
        assert(success);
    });

});
