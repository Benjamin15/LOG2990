import { UpdateInformationService } from './update-information.service';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { User } from './../../../../../../commun/models/User';

const mockBoolean: Boolean = true;
const mockFackBoolean: Boolean = false;

describe('MockBackend Update Information Service', () => {

    const user = new User('User', 'password');
    const fackUser = new User(null, null);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [UpdateInformationService]
        }).compileComponents();

        this.injector = ReflectiveInjector.resolveAndCreate([
            { provide: ConnectionBackend, useClass: MockBackend },
            { provide: RequestOptions, useClass: BaseRequestOptions },
            Http, UpdateInformationService,
        ]);
        this.updateInformationService = this.injector.get(UpdateInformationService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    }));

    it('update information should query current service url', () => {
        this.updateInformationService.update(user);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/user\/update$/, 'url invalid');
    });

    it('update information connection should be true', fakeAsync(() => {
        let result: Boolean;
        this.updateInformationService.update(user)
            .subscribe((newBoolean: Boolean) => result = newBoolean);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockBoolean,
        })));
        tick();
        expect(result).toBeTruthy('connection should be true');
    }));

    it('update information connection should be false', fakeAsync(() => {
        let result: Boolean;
        this.updateInformationService.update(fackUser)
            .subscribe((newBoolean: Boolean) => result = newBoolean);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockFackBoolean,
        })));
        tick();
        expect(result).toBeFalsy('connection be false');
    }));

    it('should get a response', fakeAsync(() => {
        let connection: MockConnection;
        let text: string;
        const backend = this.injector.get(ConnectionBackend);
        const http = this.injector.get(Http);
        backend.connections.subscribe((c: MockConnection) => connection = c);
        http.request('something.json').toPromise().then((res: any) => text = res.text());
        connection.mockRespond(new Response(new ResponseOptions({ body: 'Something' })));
        tick();
        expect(text).toBe('Something');
    }));
});
