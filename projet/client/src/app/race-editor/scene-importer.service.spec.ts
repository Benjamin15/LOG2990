import { SceneImporterService } from './scene-importer.service';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('MockBackend Scene Importer Service', () => {
    const name = 'Champignon';
    const fakeName = ' Toto ';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [SceneImporterService]
        }).compileComponents();

        this.injector = ReflectiveInjector.resolveAndCreate([
            { provide: ConnectionBackend, useClass: MockBackend },
            { provide: RequestOptions, useClass: BaseRequestOptions },
            Http, SceneImporterService,
        ]);
        this.importerService = this.injector.get(SceneImporterService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    }));

    it('get method should query current service url', () => {
        this.importerService.getCircuitByName(name);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/pisteScene\/Champignon/, 'url invalid');
    });

    it('get method connection should be true', () => {
        const result = this.importerService.getCircuitByName(name);
        result.then(value => expect(value).toBeDefined);
    });

    it('get method connection should be false', () => {
        const result = this.importerService.getCircuitByName(fakeName);
        result.then(value => expect(value).toBeUndefined);
    });

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
