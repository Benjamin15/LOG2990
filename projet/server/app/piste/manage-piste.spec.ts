import { Piste } from './../../../commun/models/Piste';
import { expect } from 'chai';
import { ManagePiste } from './manage-piste';

const managePiste = new ManagePiste();

describe('Piste', () => {

    it('should create manage Piste', () => {
        expect(managePiste).to.exist;
        expect(managePiste).to.be.an.instanceOf(ManagePiste);
    });

    it('should insert new piste', done => {
        const piste = new Piste('testPiste', 'amateur', 'piste pour les test', 'vignette', null);
        managePiste.insert(piste).then(result => {
            expect(result === true);
            done();
        });
    }).timeout(5000);

    it('shoud get list', done => {
        managePiste.getPiste().then(result => {
            expect(result.length > 0);
            done();
        });
    });

    it('get circuit testPiste', done => {
        managePiste.getCircuitByName('testPiste').then(result => {
            expect(result);
            done();
        });
    });

    it('check if circuit exist', done => {
        managePiste.checkCircuitExist('testPiste').then(result => {
            expect(result);
            done();
        });
    });

    it('check if circuit does not exist', done => {
        managePiste.checkCircuitExist('oupsmesuistrompe').then(result => {
            expect(!result);
            done();
        });
    });

    it('update testPiste', done => {
        managePiste.update('testPiste', undefined).then(result => {
            expect(result);
            done();
        });
    });

    it('delete testPiste', done => {
        managePiste.delete('testPiste', 'amateur').then(() => {
            expect(true);
            done();
        });
    });
});
