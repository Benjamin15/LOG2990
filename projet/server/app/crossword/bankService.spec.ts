import { Bank } from './bankService';
import { expect } from 'chai';
import { Configuration } from '../../../commun/models/Configuration';

describe('bank service', () => {

    it('bank service pop correctely grill', done => {
        const configuration = new Configuration(1, 'Easy', 'Classical');
        const bank = new Bank(configuration);
        bank.pop().then(value => {
            expect(value.board.tiles.length === 10);
            done();
        });
    }).timeout(10000);
});
