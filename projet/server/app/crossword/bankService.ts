import { CrosswordDatabase } from './CrosswordDatabase';
import { ManageCrossword } from './ManageCrossword';
import { Configuration } from './../../../commun/models/Configuration';
import { Crossword } from './../../../commun/models/Crossword';

export class Bank {
    private crosswordDatabase: CrosswordDatabase;
    public manageCrossword: ManageCrossword;

    constructor(private configuration: Configuration) {
        this.crosswordDatabase = new CrosswordDatabase();
        this.manageCrossword = new ManageCrossword(this.configuration.mode, this.configuration.difficulty);
    }

    public async pop(): Promise<Crossword> {
        const crossword = await this.crosswordDatabase.getCrossword(this.configuration.difficulty);
        const result = new Crossword('', crossword.difficulty);
        result.copyCrossword(crossword);
        return result;
    }

    public cancel(): void {
        this.manageCrossword.cancel();
    }
}
