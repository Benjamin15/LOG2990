import { IWord } from './../interface/Word';

export class Word implements IWord {
    constructor(public orthography: string) { }
}
