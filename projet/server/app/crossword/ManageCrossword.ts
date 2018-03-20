import { BadEndError } from './../../../commun/models/Error';
import { GenerateBlackBlock } from './GenerateBlackBlock';
import { GenerateWords } from './GenerateWord';
import { Crossword } from './../../../commun/models/Crossword';
import { LexicalService } from './../serviceLexical/LexicalService';
import { CrosswordDatabase } from './CrosswordDatabase';
import { SizeError, TryError } from '../../../commun/models/Error';

export class ManageCrossword {
    private generateBlackBlock: GenerateBlackBlock;
    private generateWord: GenerateWords;
    public crossword: Crossword;
    private lexicalService = new LexicalService();

    constructor(mode: string, difficulty: string) {
        this.crossword = new Crossword(mode, difficulty);
        this.generateBlackBlock = new GenerateBlackBlock(this.crossword.board);
        this.generateWord = new GenerateWords(this.crossword);
    }

    public clear(): void {
        this.crossword.board.tiles.forEach(element => {
            element.forEach(tile => {
                tile.clear();
            });
        });
    }

    public async generateWords(nextCrossword: Crossword): Promise<void> {
        const crosswordTemp = new Crossword('', nextCrossword.difficulty);
        crosswordTemp.copyCrossword(nextCrossword);
        this.generateWord = new GenerateWords(crosswordTemp);
        this.generateWord.createCrossword(crosswordTemp).then(async (crossword) => {
            this.crossword.copyCrossword(crossword);
            await this.findDefinitionHorizontal();
            await this.findDefinitionVertical();
            this.crossword.correctTile();
            nextCrossword.copyCrossword(this.crossword);
            nextCrossword.correctTile();
            const database = new CrosswordDatabase();
            database.insertCrossword(JSON.stringify(this.crossword));
        }).catch((e) => {
            if (e instanceof SizeError || e instanceof TryError || e instanceof BadEndError) {
                this.generateWord = new GenerateWords(this.crossword);
                this.generateWords(nextCrossword);
            }
        });
    }

    public async createCrossword(): Promise<void> {
        this.generateBlackBlock.createBlackBlocks();
        this.generateWords(this.crossword);
        this.crossword.correctTile();
    }

    private async findDefinitionVertical(): Promise<void> {
        let word = '';
        const definition = new Array<string>();
        for (let i = 0; i < this.crossword.board.tiles.length; i++) {
            for (let j = 0; j < this.crossword.board.tiles[0].length; j++) {
                if (this.crossword.board.tiles[j][i].isBlock()) {
                    if (word.length > 2) {
                        const def = await this.lexicalService.getWordDefinition(word);
                        definition.push(def);
                    }
                    word = '';
                } else {
                    word += this.crossword.board.tiles[j][i].value;
                }
            }
            if (word.length > 2) {
                const def = await this.lexicalService.getWordDefinition(word);
                definition.push(def);
            }
            word = '';
        }
        this.crossword.definitionsColumn = definition;
    }

    private async findDefinitionHorizontal(): Promise<void> {
        let word = '';
        const definition = new Array<string>();
        for (let i = 0; i < this.crossword.board.tiles.length; i++) {
            for (let j = 0; j < this.crossword.board.tiles[0].length; j++) {
                if (this.crossword.board.tiles[i][j].isBlock()) {
                    if (word.length > 2) {
                        const def = await this.lexicalService.getWordDefinition(word);
                        definition.push(def);
                    }
                    word = '';
                } else {
                    word += this.crossword.board.tiles[i][j].value;
                }
            }
            if (word.length > 2) {
                const def = await this.lexicalService.getWordDefinition(word);
                definition.push(def);
            }
            word = '';
        }
        this.crossword.definitionsLine = definition;
    }

    public cancel(): void {
        this.generateWord.cancel();
    }
}
