import { LexicalService } from './../serviceLexical/LexicalService';


const DIFFICULTY_HARD = 'hard';
const DIFFICULTY_MEDIUM = 'medium';
const LETTER_UNKNOWN = '?';

export class ManageWord {

    private static lexiqueService = new LexicalService();
    public static listWord = new Array<String>();
    private static size = 0;
    private static wordParameter = '';

    public static async loadWord(difficulty: string): Promise<void> {
        if (this.listWord.length === 0) {
            if (difficulty === DIFFICULTY_HARD) {
                this.listWord = await this.lexiqueService.fillWordsHard();
            } else if (difficulty === DIFFICULTY_MEDIUM) {
                this.listWord = await this.lexiqueService.fillWordsMedium();
            } else {
                this.listWord = await this.lexiqueService.fillWords();
            }
        }
    }
    public static getWordBySize(size: number): string {
        this.size = size;
        const words = this.listWord.filter(this.wordSize);
        const indexRandom = Math.floor(Math.random() * words.length - 1);
        let result: string;
        if (words.length > 0) {
            result = words[indexRandom].toString();
        }
        return result;
    }

    public static getWordByLetterPosition(fracWord: string): string {
        this.wordParameter = fracWord;
        const tmp = this;
        const words = this.listWord.filter((word: string) => {
            return tmp.wordByLetter(word);
        });
        const indexRandom = Math.floor(Math.random() * (words.length - 1));
        let result: string;
        if (words.length > 0) {
            result = words[indexRandom].toString();
        }
        return result;
    }

    public static isExistingWord(word: string): boolean {
        const tab = this.listWord.filter((wordFilter) => {
            if (word.length === 1) {
                return true;
            }
            if (word.length !== wordFilter.length) {
                return false;
            }
            for (let i = 0; i < word.length; i++) {
                if (word[i] !== LETTER_UNKNOWN && word[i].toLowerCase() !== wordFilter[i].toLowerCase()) {
                    return false;
                }
            }
            return true;
        });
        return tab.length > 0;
    }

    private static wordSize(word: string): boolean {
        return word.length === this.size;
    }

    private static wordByLetter(word: string): boolean {
        if (word.toLowerCase() === this.wordParameter.toLowerCase()) {
            return true;
        }
        if (word.length !== this.wordParameter.length) {
            return false;
        }
        for (let i = 0; i < this.wordParameter.length; i++) {
            if (word[i] !== undefined) {
                if (this.wordParameter[i] !== LETTER_UNKNOWN && this.wordParameter[i].toLowerCase() !== word[i].toLowerCase()) {
                    return false;
                }
            }
        }
        return true;
    }
}
