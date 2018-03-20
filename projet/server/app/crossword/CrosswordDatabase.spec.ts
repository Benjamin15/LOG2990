import { expect } from 'chai';
import { CrosswordDatabase } from './CrosswordDatabase';
import { Crossword } from '../../../commun/models/Crossword';

describe('crossword database', () => {

    let crossword: Crossword;
    it('get grill', done => {
        const crosswordDatabase = new CrosswordDatabase();
        crosswordDatabase.getCrossword('Easy').then(value => {
            crossword = value;
            expect(value);
            done();
        });
    }).timeout(10000);

    it('insert grill', done => {
        const crosswordDatabase = new CrosswordDatabase();
        crosswordDatabase.insertCrossword(JSON.stringify(crossword));
        expect(true);
        done();
    }).timeout(10000);
});
