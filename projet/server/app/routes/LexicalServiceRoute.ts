import express = require('express');
import * as CrosswordRoute from './Crossword';

const customerRouter = express.Router();
const crossword: CrosswordRoute.CrosswordData = new CrosswordRoute.CrosswordData();
customerRouter.get('/list/medium/size/:size', crossword.getMediumWordBySize.bind(crossword.getMediumWordBySize));
customerRouter.get('/list/commun/size/:size', crossword.getCommunWordBySize.bind(crossword.getCommunWordBySize));
customerRouter.get('/word/:word/definition', crossword.getDefinition.bind(crossword.getDefinition));
customerRouter.get('/list/rare/size/:size', crossword.getRareWordBySize.bind(crossword.getRareWordBySize));
customerRouter.get('/word/size/:size', crossword.getWordBySize.bind(crossword.getWordBySize));
customerRouter.get('/list/commun', crossword.getCommunWord.bind(crossword.getCommunWord));
customerRouter.get('/list/medium', crossword.getMediumWord.bind(crossword.getMediumWord));
customerRouter.get('/word/:word', crossword.getWordByLetterPosition.bind(crossword.getWordByLetterPosition));
customerRouter.get('/list/rare', crossword.getRareWord.bind(crossword.getRareWord));
customerRouter.get('/list', crossword.getListWords.bind(crossword.getListWords));
export = customerRouter;
