import { crosswordSchema } from '../schemas/Crossword';
import { ICrosswordModel } from './../interface/model';
import { Database } from './../database/Database';
import { Crossword } from './../../../commun/models/Crossword';

export class CrosswordDatabase {

    public async insertCrossword(crossword: string): Promise<void> {
        const database = new Database<Crossword, ICrosswordModel>('crossword', crosswordSchema);
        await database.connect();
        await database.insert({crossword: crossword});
        database.close();
    }

    public async getCrossword(difficulty: string): Promise<Crossword> {
        const database = new Database<Crossword, ICrosswordModel>('crossword', crosswordSchema);
        await database.connect();
        const crossword = (await database.find());
        database.close();
        const crosswordWithDifficulty = crossword.filter(value => {
            if (value.get('crossword')) {
            return (<Crossword> JSON.parse(value.get('crossword').toString())).difficulty === difficulty;
            } else {
                return false;
            }
        });
        const random = Math.floor(Math.random() * crosswordWithDifficulty.length);
        return JSON.parse(crosswordWithDifficulty[random].get('crossword').toString());
    }
}
