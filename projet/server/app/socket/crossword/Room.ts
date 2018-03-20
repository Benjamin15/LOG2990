import { ManageCrossword } from './../../crossword/ManageCrossword';
import { Configuration } from './../../../../commun/models/Configuration';
import { Crossword } from './../../../../commun/models/Crossword';
import { Player } from './../../../../commun/models/Player';
import { Timer } from './../../../../commun/services/Timer';
import { Bank } from './../../crossword/bankService';

const DYNAMIC = 'Dynamic';

export class Room {
    public nextCrossword: Crossword;
    private bankCrossword: Bank;
    private crossword: Crossword;
    private players: Array<Player>;
    private timer: Timer;
    private countReset: number;
    private manageCrossword: ManageCrossword;
    private clearGrill: Crossword;

    constructor(private name: string, private configuration: Configuration) {
        this.bankCrossword = new Bank(configuration);
        this.players = new Array<Player>();
        this.players.push(new Player(name));
        this.timer = new Timer();
        this.countReset = 0;
        this.nextCrossword = new Crossword('', this.configuration.difficulty);
        this.manageCrossword = new ManageCrossword('', this.configuration.difficulty);
        this.clearGrill = new Crossword('', this.configuration.difficulty);
    }

    public getTimer(): number {
        return this.timer.getTimer();
    }

    public getName(): string {
        return this.name;
    }

    public getPlayers(): Array<Player> {
        return this.players;
    }

    public getConfiguration(): Configuration {
        return this.configuration;
    }

    public getCrossword(): Crossword {
        return this.crossword;
    }

    public async startGame(): Promise<void> {
        this.crossword = new Crossword('', this.configuration.difficulty);
        this.crossword.copyCrossword(await this.bankCrossword.pop());
        this.clearGrill.copyCrossword(this.crossword);
        this.clearGrill.clear();
        if (this.configuration.mode === DYNAMIC) {
            this.startTimer();
        }
        this.nextCrossword.copyCrossword(this.clearGrill);
        this.manageCrossword.generateWords(this.nextCrossword);
    }

    public async generateNextCrossword(): Promise<void> {
        this.manageCrossword.crossword = this.clearGrill;
        this.nextCrossword.copyCrossword(this.clearGrill);
        this.manageCrossword.generateWords(this.nextCrossword);
    }

    public switchCrossword(): void {
        this.crossword = this.nextCrossword;
    }

    public stopTimer(): void {
        this.timer = new Timer();
    }

    public startTimer(): void {
        this.timer.startTimer();
    }

    public setTimer(time: number) {
        if (time > 0) {
            this.timer.setStart(time);
        }
        this.startTimer();
    }

    public addPlayer(player: Player): boolean {
        let succes = false;
        if (this.players.length < this.configuration.nPlayer) {
            this.players.push(player);
            succes = true;
        }
        return succes;
    }


    public wordFind(namePlayer: string, word: string): void {
        this.startTimer();
        this.addWordPlayer(namePlayer, word);
        if (this.configuration.mode === DYNAMIC) {
            this.clearGrill.addWord(word, this.crossword);
            this.generateNextCrossword();
        }
    }

    private addWordPlayer(namePlayer: string, word: string): void {
        this.players.forEach(player => {
            if (player.getName() === namePlayer) {
                player.addWordFind(word);
            }
        });
    }

    public endGame(): boolean {
        const totalWords = this.crossword.definitionsColumn.length + this.crossword.definitionsLine.length;
        let scorePlayers = 0;
        this.players.forEach(player => {
            scorePlayers += player.getScore();
        });
        return (totalWords === scorePlayers) ? true : false;
    }

    public async resetGame(): Promise<boolean> {
        this.countReset++;
        if (this.countReset === this.players.length) {
            this.timer = new Timer();
            this.countReset = 0;
            this.players.forEach(player => {
                player.initAttribut();
            });
            await this.startGame();
            return true;
        }
        return false;
    }
}
