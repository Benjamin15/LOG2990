import { userSchema } from '../schemas/user';
import { IUserModel } from './../interface/model';
import { Database } from './../database/Database';
import { User } from './../../../commun/models/User';

export class ManageUser {

    public async authentificate(user: User): Promise<boolean> {
        const database = new Database<User, IUserModel>('Users', userSchema);

        await database.connect();
        const result = await database.findOne(user);
        database.close();
        return result;
    }

    public async updateInformation(email: string, user: User): Promise<boolean> {
        const database = new Database<User, IUserModel>('Users', userSchema);
        const oldInformation = { email: email };
        const newInformation = user;

        await database.connect();
        const result = await database.update(oldInformation, newInformation);
        database.close();
        return result;
    }
}
