import * as http from 'http';
import { expect } from 'chai';
import { ManageSocket } from './ManageSocket';
import { Application } from './../app';

describe('SocketManager', () => {

    const application: Application = Application.bootstrap();
    const appPort = normalizePort(process.env.PORT || '3000');
    application.app.set('port', appPort);
    const server = http.createServer(application.app);

    const manageSocket = new ManageSocket(require('socket.io').listen(server));

    describe('Default constructor ', () => {
        it('should create manage socket', done => {
            expect(manageSocket).to.exist;
            expect(manageSocket).to.be.an.instanceOf(ManageSocket);
            done();
        });
    });
});


function normalizePort(val: number | string): number | string | boolean {
    const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    } else if (port >= 0) {
        return port;
    } else {
        return false;
    }
}
