import * as express from 'express';
import { ManagePiste } from './../piste/manage-piste';

module Route {

    export class PisteData {
        public async createPiste(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const managePiste = new ManagePiste();
            managePiste.insert(req.body);
        }

        public async getListPiste(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const managePiste = new ManagePiste();
            res.send(await managePiste.getPiste());
        }

        public async getCircuitByName(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const managePiste = new ManagePiste();
            res.send(JSON.stringify(await managePiste.getCircuitByName(req.params.name)));
        }

        public async checkCircuitExistence(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const managePiste = new ManagePiste();
            res.send(await managePiste.checkCircuitExist(req.params.name));
        }

        public async updatePistInformation(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const managePiste = new ManagePiste();
            res.send(await managePiste.update(req.params.oldPisteName, req.body.piste));
        }

        public async deletePiste(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const managePiste = new ManagePiste();
            await managePiste.delete(req.body.name, req.body.type);
        }

        public async sendAppreciation(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const managePiste = new ManagePiste();
            await managePiste.sendAppreciation(req.params.name, req.params.appreciation);
            res.send(true);
        }

        public async sendBestTimes(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const managePiste = new ManagePiste();
            await managePiste.sendBestTimes(req.params.name, req.params.bestTimes);
            res.send(true);
        }
    }
}
export = Route;
