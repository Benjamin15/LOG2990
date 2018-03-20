export class Player {
    public wordsFind: Array<string>;
    public score: number;

    constructor(public name: string) {
        this.initAttribut();
    }

    public getName(): string {
        return this.name;
    }

    public getScore(): number {
        return this.score;
    }

    public addWordFind(word: string): void {
        this.wordsFind.push(word);
        this.score++;
    }

    public initAttribut(): void {
        this.score = 0;
        this.wordsFind = new Array<string>();
    }
}
