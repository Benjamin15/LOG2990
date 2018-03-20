import { IPisteModel } from './../interface/model';
import { pisteSchema } from './../schemas/Piste';
import { Database } from './../database/Database';
import { Piste } from './../../../commun/models/Piste';
import { Document } from 'mongoose';

export class ManagePiste {

    public async insert(piste: Piste): Promise<boolean> {
        const database = new Database<Piste, IPisteModel>('Pistes', pisteSchema);
        await database.connect();
        await database.insert(piste);
        database.close();
        return true;
    }

    public async getPiste(): Promise<Array<Document>> {
        const database = new Database<Piste, IPisteModel>('Pistes', pisteSchema);
        await database.connect();
        const array = await database.find();
        database.close();
        return array;
    }

    public async getCircuitByName(name: string): Promise<Piste> {
        const database = new Database<Piste, IPisteModel>('Pistes', pisteSchema);
        await database.connect();
        const piste = <Piste>(await database.getFindOne({ name })).toJSON();
        database.close();
        return piste;
    }

    public async checkCircuitExist(name: string): Promise<boolean> {
        const database = new Database<Piste, IPisteModel>('Pistes', pisteSchema);
        await database.connect();
        const piste = (await database.findOne({ name }));
        database.close();
        return piste;
    }

    public async update(name: string, piste: Piste): Promise<boolean> {
        const database = new Database<Piste, IPisteModel>('Piste', pisteSchema);
        const oldInformation = { name: name };
        const newInformation = piste;
        await database.connect();
        const result = await database.update(oldInformation, newInformation);
        database.close();
        return result;
    }

    public async delete(name: string, type: string): Promise<void> {
        const database = new Database<Piste, IPisteModel>('Pistes', pisteSchema);
        await database.connect();
        await database.delete({ name: name, type: type });
        database.close();
    }

    public async sendAppreciation(name: string, appreciation: number): Promise<void> {
        const piste = await this.getCircuitByName(name);
        if (piste.averageAppreciation === null) {
            piste.averageAppreciation = new Array<number>();
        }
        piste.averageAppreciation.push(appreciation);
        this.update(piste.name, piste);
    }

    public async sendBestTimes(name: string, bestTimes: string): Promise<void> {
        const piste = await this.getCircuitByName(name);
        piste.bestTimes = bestTimes;
        this.update(piste.name, piste);
    }
}
