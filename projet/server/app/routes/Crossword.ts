import * as express from 'express';
import { LexicalService } from './../serviceLexical/LexicalService';
import { Bank } from '../crossword/bankService';
import { Configuration } from '../../../commun/models/Configuration';

module Route {
    export class CrosswordData {

        public getListWords(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const lexicalService = new LexicalService();
            lexicalService.fillWords().then(values => {
                res.send(values);
            });
        }

        public async getWordByLetterPosition(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const lexicalService = new LexicalService();
            res.send(JSON.stringify(await lexicalService.getWordByLetterPosition(req.params.word)));
        }

        public async getWordBySize(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const lexicalService = new LexicalService();
            res.send(JSON.stringify(await lexicalService.getWordBySize(req.params.size)));
        }

        public async getCommunWord(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const lexicalService = new LexicalService();
            res.send(JSON.stringify(await lexicalService.getCommunWords()));
        }

        public async getMediumWord(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const lexicalService = new LexicalService();
            res.send(JSON.stringify(await lexicalService.getMediumUseWords()));
        }

        public async getRareWord(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const lexicalService = new LexicalService();
            res.send(JSON.stringify(await lexicalService.getRareWords()));
        }

        public async getCommunWordBySize(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const lexicalService = new LexicalService();
            res.send(JSON.stringify(await lexicalService.getCommunWordsBySize(req.params.size)));
        }

        public async getMediumWordBySize(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const lexicalService = new LexicalService();
            res.send(JSON.stringify(await lexicalService.getMediumUseWordsBySize(req.params.size)));
        }

        public async getRareWordBySize(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const lexicalService = new LexicalService();
            res.send(JSON.stringify(await lexicalService.getRareWordsBySize(req.params.size)));
        }

        public async getDefinition(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const lexicalService = new LexicalService();
            res.send(JSON.stringify(await lexicalService.getWordDefinition(req.params.word)));
        }

        public async launchGame(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const configuration = new Configuration(1, req.params.difficulty, '');
            const bank = new Bank(configuration);
            res.send(await bank.pop());
        }
    }
}
export = Route;
