import { AuthenticationService } from './authentication.service';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { User } from './../../../../../../commun/models/User';

const mockBoolean: Boolean = true;
const mockFackBoolean: Boolean = false;

describe('MockBackend Send Crossword Authentication Service', () => {
    const user = new User('admin', 'testmdp');

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [AuthenticationService]
        }).compileComponents();

        this.injector = ReflectiveInjector.resolveAndCreate([
            { provide: ConnectionBackend, useClass: MockBackend },
            { provide: RequestOptions, useClass: BaseRequestOptions },
            Http, AuthenticationService,
        ]);
        this.authenticationService = this.injector.get(AuthenticationService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    }));

    it('login() should query current service url', () => {
        this.authenticationService.login(user);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/authentication$/, 'url invalid');
    });

    it('login() connection should true', fakeAsync(() => {
        let result: Boolean;
        this.authenticationService.login(user)
            .subscribe((newBoolean: Boolean) => result = newBoolean);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockBoolean,
        })));
        tick();
        expect(result).toBeTruthy('should contain true');
    }));

    it('login() connection should false', fakeAsync(() => {
        let result: Boolean;
        this.authenticationService.login(user)
            .subscribe((newBoolean: Boolean) => result = newBoolean);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockFackBoolean,
        })));
        tick();
        expect(result).toBeFalsy('should contain false');
    }));

    it('logout() connection should true', fakeAsync(() => {
        expect(this.authenticationService.logout()).toBeUndefined();
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
