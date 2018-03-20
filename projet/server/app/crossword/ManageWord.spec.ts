import { ManageWord } from './ManageWord';
import { expect } from 'chai';

describe('manage word', () => {

    it('should words Easy is load', (done) => {
        ManageWord.loadWord('Easy').then( () => {
            expect(ManageWord.listWord.length > 0);
            done();
        });
    }).timeout(10000);

    it('should words Normal is load', (done) => {
        ManageWord.loadWord('Normal').then( () => {
            expect(ManageWord.listWord.length > 0);
            done();
        });
    }).timeout(10000);

    it('should words Expert is load', (done) => {
        ManageWord.loadWord('Expert').then( () => {
            expect(ManageWord.listWord.length > 0);
            done();
        });
    }).timeout(10000);

    it ('getWordByLetterPostion', (done) => {
        expect(ManageWord.getWordByLetterPosition('??a').length === 3);
        done();
    }).timeout(10000);

    it ('is existing word', (done) => {
        expect(ManageWord.isExistingWord('aalii'));
        done();
    }).timeout(10000);
});
