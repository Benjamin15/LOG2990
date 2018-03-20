import * as http from 'http';
import { IWordModel } from './../interface/model';
import { wordSchema } from './../schemas/Word';
import { Database } from './../../../server/app/database/Database';
import { Word } from './../../../commun/models/Word';

const API_KEY = '0c21877a7d7e15ea2000c0f4ba50526e963b48813e952074d';
export class LexicalService {
    public words: Array<string>;

    constructor() {
        this.words = new Array<string>();
    }

    public async fillWords(): Promise<Array<string>> {
        const database = new Database<Word, IWordModel>('words', wordSchema);
        await database.connect();
        await database.find().then(values => {
            values.forEach(element => {
                this.words.push(element.get('word'));
            });
        });
        database.close();
        return this.words;
    }

    public async fillWordsMedium(): Promise<Array<string>> {
        const database = new Database<Word, IWordModel>('wordsMedium', wordSchema);
        await database.connect();
        await database.find().then(values => {
            values.forEach(element => {
                this.words.push(element.get('word'));
            });
        });
        database.close();
        return this.words;
    }

    public async fillWordsHard(): Promise<Array<string>> {
        const database = new Database<Word, IWordModel>('wordsHard', wordSchema);
        await database.connect();
        await database.find().then(values => {
            values.forEach(element => {
                this.words.push(element.get('word'));
            });
        });
        database.close();
        return this.words;
    }

    public async  getWordBySize(size: Number): Promise<Array<string>> {
        const url: string = 'http://api.wordnik.com:80/v4/words.json/search/*?caseSensitive=false&minLength=' + size +
            '&maxLength=' + size +
            '&skip=0&limit=10000&api_key=' + API_KEY;
        return await this.request(url);
    }

    public async getWordByLetterPosition(word: string): Promise<Array<string>> {
        const size = word.length;
        word = this.replaceUnknow(word);
        const url: string = 'http://api.wordnik.com/v4/words.json/search/' + word + '?caseSensitive=false&minLength=' + size +
            '&maxLength=' + size + '&skip=0&limit=10000&api_key=' + API_KEY;
        return await this.request(url);
    }

    private replaceUnknow(word: string): string {
        let wordReplace = word.toString();
        while (wordReplace.indexOf('?') > -1) {
            wordReplace = wordReplace.replace('?', '%3F');
        }
        return wordReplace;
    }

    public async getCommunWords(): Promise<Array<string>> {
        const url: string = 'http://api.wordnik.com:80/v4/words.json/search/*?caseSensitive=false&minCorpusCount=100000&' +
            'minLength=3&maxLength=10&skip=0&limit=10000&api_key=' + API_KEY;
        return await this.request(url);
    }

    public async getMediumUseWords(): Promise<Array<string>> {
        const url: string = 'http://api.wordnik.com:80/v4/words.json/search/*?caseSensitive=false&minCorpusCount=50000&' +
            'maxCorpusCount=100000&minLength=3&maxLength=10&skip=0&limit=10000&api_key=' + API_KEY;
        return await this.request(url);
    }

    public async getRareWords(): Promise<Array<string>> {
        const url: string = 'http://api.wordnik.com:80/v4/words.json/search/*?caseSensitive=false&maxCorpusCount=20&' +
            'minLength=3&maxLength=10&skip=0&limit=10000&api_key=' + API_KEY;
        return await this.request(url);
    }

    public async getWordDefinition(word: string, level?: boolean): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const url: string = 'http://api.wordnik.com:80/v4/word.json/' + word +
                '/definitions?limit=5&includeRelated=true&useCanonical=false&includeTags=false&api_key=' + API_KEY;
            await http.get(url, async (res: http.IncomingMessage) => {
                let rawData = '';
                await res.on('data', (chunk) => { rawData += chunk; });
                await res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        let index = 0;
                        if (level && parsedData.length > 1) {
                            index = Math.floor(Math.random() * 4) + 1;
                        } else if (parsedData[index] === undefined) {
                            index = 1;
                        }
                        if (parsedData[index] !== undefined) {
                            resolve(parsedData[index].text);
                        } else {
                            const error = 'not found word';
                            resolve(error);
                            reject(error);
                        }
                    } catch (error) {
                        throw new Error('wordnik error');
                    }
                });
            });
        });
    }

    public async getCommunWordsBySize(size: number): Promise<Array<string>> {
        const url: string = 'http://api.wordnik.com:80/v4/words.json/search/*?caseSensitive=false&minCorpusCount=100000&' +
            'minLength=' + size + '&maxLength=' + size + '&skip=0&limit=10000&api_key=' + API_KEY;
        return await this.request(url);
    }

    public async getMediumUseWordsBySize(size: number): Promise<Array<string>> {
        const url: string = 'http://api.wordnik.com:80/v4/words.json/search/*?caseSensitive=false&minCorpusCount=50000&' +
            'maxCorpusCount=100000&minLength=' + size + '&maxLength=' + size + '&skip=0&limit=10000&' +
            'api_key=' + API_KEY;
        return await this.request(url);
    }

    public async isExistingWord(word: string): Promise<boolean> {
        const size = word.length;
        word = this.replaceUnknow(word);
        const url = 'http://api.wordnik.com:80/v4/words.json/search/' + word
            + '?caseSensitive=false&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1'
            + '&maxDictionaryCount=-1&minLength=' + size + '&maxLength=' + size
            + '&skip=0&limit=1&api_key=' + API_KEY;
        return (await this.request(url)).length > 0;
    }

    public async getRareWordsBySize(size: number): Promise<Array<string>> {
        const url: string = 'http://api.wordnik.com:80/v4/words.json/search/*?caseSensitive=false&maxCorpusCount=20&' +
            'minLength=' + size + '&maxLength=' + size + '&skip=0&limit=10000&api_key=' + API_KEY;
        return await this.request(url);
    }

    private request(url: string): Promise<Array<string>> {
        return new Promise<Array<string>>(async (resolve, reject) => {
            await http.get(url, async (res: http.IncomingMessage) => {
                let rawData = '';
                await res.on('data', (chunk) => { rawData += chunk; });
                await res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        const array = Array<string>();
                        if (parsedData.searchResults !== undefined) {
                            for (let i = 0; i < parsedData.searchResults.length; i++) {
                                array.push(parsedData.searchResults[i].word);
                            }
                        }
                        resolve(array);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        });
    }
}
