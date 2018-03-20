import { IUserModel } from './../../server/app/interface/model';
import { IUser } from './../interface/User';

export class UserModel {

    private userModele: IUserModel;

    constructor(userModele: IUserModel) {
        this.userModele = userModele;
    }

    public getEmail(): string {
        return this.userModele.email;
    }

    public getPassword(): string {
        return this.userModele.password;
    }
}

export class User implements IUser {
    constructor(public email: string, public password: string) {
    }
}
