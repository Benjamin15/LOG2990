import { expect } from 'chai';
import { ManageUser } from './manage-user';
import { User } from './../../../commun/models/User';

const manageUser = new ManageUser();

describe('Utilisateur', () => {

    it('should create manage User', () => {
        expect(manageUser).to.exist;
        expect(manageUser).to.be.an.instanceOf(ManageUser);
    });

    it('should find user admin who have password testmdp', done => {
        const user = new User('admin', 'testmdp');
        manageUser.authentificate(user).then(result => {
            expect(result === true);
            done();
        });
    }).timeout(5000);

    it('should find wrong user admin', done => {
        const user = new User('adman', 'testmdp');
        manageUser.authentificate(user).then(result => {
            expect(result === false);
            done();
        });
    }).timeout(5000);

    it('should updateInformation to be true', done => {
        let user = new User('adman', 'testmdp');
        manageUser.updateInformation('admin', user).then(result => {
            user = new User('admin', 'testmdp');
            manageUser.updateInformation('adman', user).then(succes => {
                expect(result === true).to.be.true;
                done();
            });
        });
    }).timeout(5000);

    it('should updateInformation false to be false', done => {
        const user = new User('adman', 'testmdp');
        manageUser.updateInformation('errorAdmin', user).then(result => {
            expect(result).to.be.false;
            done();
        });
    }).timeout(1000);
});
