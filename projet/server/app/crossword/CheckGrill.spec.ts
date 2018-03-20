import { CheckGrill } from './CheckGrill';
import { expect } from 'chai';
import { CrosswordDatabase } from './CrosswordDatabase';
import { Crossword } from '../../../commun/models/Crossword';

describe('check grill', () => {

    it('should grill is okay', done => {
        const crosswordDatabase = new CrosswordDatabase();
        crosswordDatabase.getCrossword('Easy').then(value => {
            const crossword = new Crossword('Classical', 'Easy');
            crossword.copyCrossword(value);
            expect(CheckGrill.verifyGrill(crossword));
            done();
        });
    }).timeout(10000);

    it('should grill is not okay', done => {
        const crosswordDatabase = new CrosswordDatabase();
        crosswordDatabase.getCrossword('Easy').then(value => {
            const crossword = new Crossword('Classical', 'Easy');
            crossword.copyCrossword(value);
            for (let i = 0 ; i < 10 ; i++) {
                crossword.board.tiles[0][i].value = 'A';
            }
            expect(!CheckGrill.verifyGrill(crossword));
            done();
        });
    }).timeout(10000);
});

