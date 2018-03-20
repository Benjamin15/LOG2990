import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CrosswordService } from './crossword.service';
import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('MockBackend Send Crossword Configuration Service', () => {

    beforeEach((() => {
        TestBed.configureTestingModule({
            providers: [CrosswordService]
        }).compileComponents();

        this.injector = ReflectiveInjector.resolveAndCreate([
            { provide: ConnectionBackend, useClass: MockBackend },
            { provide: RequestOptions, useClass: BaseRequestOptions },
            Http, CrosswordService,
        ]);
        this.crosswordService = this.injector.get(CrosswordService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    }));

    it('getTimer() return an observable timer', fakeAsync(() => {
        const result = this.crosswordService.getTimer();
        expect(result !== undefined).toBeTruthy();
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
