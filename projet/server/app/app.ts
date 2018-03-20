/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as AdministrationRoute from './routes/Administration';
import * as CrosswordRoute from './routes/Crossword';
import * as PisteRoute from './routes/Piste';

import * as lexicalRoute from './routes/LexicalServiceRoute';
export class Application {

    public app: express.Express;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this this.app.
     */
    public static bootstrap(): Application {
        return new Application();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        // Application instantiation
        this.app = express();

        // configure this.application
        this.config();

        // configure routes
        this.routes();

    }

    /**
     * The config function.
     *
     * @class Server
     * @method config
     */
    private config() {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../client')));
        this.app.use(cors());
    }

    /**
     * The routes function.
     *
     * @class Server
     * @method routes
     */
    public routes() {
        let router: express.Router;
        router = express.Router();

        // create routes
        const administration: AdministrationRoute.Administration = new AdministrationRoute.Administration();
        const crossword: CrosswordRoute.CrosswordData = new CrosswordRoute.CrosswordData();
        const pisteInformation: PisteRoute.PisteData = new PisteRoute.PisteData();

        // authentication
        router.post('/authentication', bodyParser.json(), administration.authentication.bind(administration.authentication));

        // update user
        router.post('/user/update', bodyParser.json(), administration.updateInformation.bind(administration.updateInformation));

        // administrator-update on piste information
        router.post('/pisteSpecification/post', bodyParser.json(), pisteInformation.createPiste.bind(pisteInformation.createPiste));

        // race-editor saving a piste
        router.post('/pisteScene/post', bodyParser.json(), pisteInformation.createPiste.bind(pisteInformation.createPiste));

        // race-editor saving a piste
        router.post('/pisteScene/update', bodyParser.json(), pisteInformation.updatePistInformation.
            bind(pisteInformation.updatePistInformation));

        // check if circuit exists
        router.get('/pisteScene/get/:name', bodyParser.json(),
            pisteInformation.checkCircuitExistence.bind(pisteInformation.checkCircuitExistence));

        // get list
        router.get('/piste/get', pisteInformation.getListPiste.bind(pisteInformation.getListPiste));

        // set average appreciation
        router.get('/piste/appreciation/:name/:appreciation', pisteInformation.sendAppreciation.bind(pisteInformation.sendAppreciation));

        // administrator delete piste
        router.post('/piste/delete', bodyParser.json(), pisteInformation.deletePiste.bind(pisteInformation.deletePiste));

        // send bestTimes array
        router.get('/piste/bestTimes/:name/:bestTimes', pisteInformation.sendBestTimes.bind(pisteInformation.sendBestTimes));

        // administrator create piste
        router.post('/piste/create', bodyParser.json(), pisteInformation.createPiste.bind(pisteInformation.createPiste));

        // administrator update information piste
        // router.post('/piste/update', bodyParser.json(), pisteInformation.updatePiste.bind(pisteInformation.updatePiste));

        // get circuit by name
        router.get('/pisteScene/:name', bodyParser.json(), pisteInformation.getCircuitByName.bind(pisteInformation.getCircuitByName));

        // get lexical fonctions
        router.get('/lexique/list/commun/size/:size', crossword.getCommunWordBySize.bind(crossword.getCommunWordBySize));
        router.get('/lexique/list/medium/size/:size', crossword.getMediumWordBySize.bind(crossword.getMediumWordBySize));
        router.get('/lexique/word/:word/definition', crossword.getDefinition.bind(crossword.getDefinition));
        router.get('/lexique/list/rare/size/:size', crossword.getRareWordBySize.bind(crossword.getRareWordBySize));
        router.get('/lexique/word/size/:size', crossword.getWordBySize.bind(crossword.getWordBySize));
        router.get('/lexique/list/commun', crossword.getCommunWord.bind(crossword.getCommunWord));
        router.get('/lexique/list/medium', crossword.getMediumWord.bind(crossword.getMediumWord));
        router.get('/lexique/word/:word', crossword.getWordByLetterPosition.bind(crossword.getWordByLetterPosition));
        router.get('/lexique/list/rare', crossword.getRareWord.bind(crossword.getRareWord));
        router.get('/lexique/list', crossword.getListWords.bind(crossword.getListWords));

        // get crossword
        router.get('/crossword/:difficulty', crossword.launchGame.bind(crossword.launchGame));

        // use router middleware
        this.app.use(router);
        this.app.use('/lexical', lexicalRoute);
        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || 500);
                res.send({
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }
}
