import * as express from 'express';
import { ManageUser } from './../user/manage-user';

module Route {

    export class Administration {

        public async authentication(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const manageUser = new ManageUser();
            res.send(await manageUser.authentificate(req.body.user));
        }

        public async updateInformation(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const manageUser = new ManageUser();
            res.send(await manageUser.updateInformation(req.body.oldEmail, req.body.user));
        }
    }
}
export = Route;
