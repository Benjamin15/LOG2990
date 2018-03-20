// import { Word } from './../crossword/Word';
import { LexicalService } from './LexicalService';
import { expect } from 'chai';

describe('LexicalService', () => {

    it('should get all five letter words from the database in less than five seconds', (done) => {

        const lexicalService = new LexicalService();
        lexicalService.getWordBySize(5).then(values => {
            let succes = true;
            values.forEach(value => {
                if (value.length !== 5) {
                    succes = false;
                }
            });
            expect(succes);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(5000);

    it('should get all words that have two letters that could be anything from the database in less than five seconds', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getWordByLetterPosition('??').then(values => {
            expect(values);
            expect(values.length > 500);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should get all words with a high frequency from the database', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getCommunWords().then(values => {
            expect(values);
            expect(values.length > 500);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should get all words with a medium frequency from the database', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getMediumUseWords().then(values => {
            expect(values);
            expect(values.length > 500);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should get all words with a low frequency from the database', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getRareWords().then(values => {
            expect(values);
            expect(values.length > 500);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should get the first definition of the word banana from the database, a word which has many definitions', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getWordDefinition('banana', false).then(values => {
            expect(values !== undefined);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should get any of definition except for the first for the word banana', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getWordDefinition('banana', true).then(values => {
            expect(values !== undefined);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should get any of definition except for the first for the word aalii', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getWordDefinition('aalii', true).then(values => {
            expect(values !== undefined);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should not return any definitions for the word agassa because it does not exist', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getWordDefinition('agassa', false).then(values => {
            expect(values === 'not found word');
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should return high frequency words which have four letters', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getCommunWordsBySize(4).then(values => {
            let succes = true;
            values.forEach(value => {
                if (value.length !== 4) {
                    succes = false;
                }
            });
            expect(succes);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should return medium frequency words which have five letters', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getMediumUseWordsBySize(5).then(values => {
            let succes = true;
            values.forEach(value => {
                if (value.length !== 5) {
                    succes = false;
                }
            });
            expect(succes);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);

    it('should return low frequency words which have four letters', (done) => {
        const lexicalService = new LexicalService();
        lexicalService.getRareWordsBySize(6).then(values => {
            let succes = true;
            values.forEach(value => {
                if (value.length !== 6) {
                    succes = false;
                }
            });
            expect(succes);
            done();
        }).catch(error => {
            expect(false);
            done(error);
        });
    }).timeout(10000);
});
