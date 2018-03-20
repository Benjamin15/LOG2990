import { PisteSpecificationService } from './piste-specification.service';
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Piste } from './../../../../../../commun/models/Piste';

const mockPistes: Piste[] = new Array<Piste>();
mockPistes.push(new Piste('piste1', 'easy', 'blabla'));
const mockBoolean: Boolean = true;
const mockFackBoolean: Boolean = false;

describe('Piste Specification Service', () => {

    let configuration: Array<Piste> = new Array<Piste>();
    const oldPisteName = 'Champignon';
    const fakeOldPisteName = ' Toto ';
    const pistToUpdate = new Piste('Champignonerie ', ' ', ' ');
    mockPistes.push(new Piste('piste2', 'expert', 'blabla12'));
    configuration = mockPistes;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [PisteSpecificationService]
        }).compileComponents();

        this.injector = ReflectiveInjector.resolveAndCreate([
            { provide: ConnectionBackend, useClass: MockBackend },
            { provide: RequestOptions, useClass: BaseRequestOptions },
            Http, PisteSpecificationService,
        ]);
        this.pisteSpecificationService = this.injector.get(PisteSpecificationService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    }));

    it('insert() should query current service url', () => {
        this.pisteSpecificationService.insert(configuration);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/piste\/create/, 'url invalid');
    });

    it('insert() should return one list of pistes', () => {
        const result = this.pisteSpecificationService.insert(configuration);
        result.then((value) => expect(value).toBe(true));
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

    it('update method should query current service url', () => {
        this.pisteSpecificationService.updateInfos(oldPisteName, pistToUpdate);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/pisteScene\/update$/, 'url invalid');
    });

    it('update method connection should be true', fakeAsync(() => {
        let result: Boolean;
        this.pisteSpecificationService.updateInfos(oldPisteName, pistToUpdate)
            .subscribe((newBoolean: Boolean) => result = newBoolean);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockBoolean,
        })));
        tick();
        expect(result).toBeTruthy('connection should be true');
    }));

    it('update information connection should be false', fakeAsync(() => {
        let result: Boolean;
        this.pisteSpecificationService.updateInfos(fakeOldPisteName, pistToUpdate)
            .subscribe((newBoolean: Boolean) => result = newBoolean);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockFackBoolean,
        })));
        tick();
        expect(result).toBeFalsy('connection should be true');
    }));

    it('listPiste() should query current service url', () => {
        this.pisteSpecificationService.listPiste();
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/piste\/get$/, 'url invalid');
    });

    it('listPiste() should return one list of pistes', fakeAsync(() => {
        let result: Array<Piste>;
        this.pisteSpecificationService.listPiste()
            .then((newPistLites: Array<Piste>) => result = newPistLites);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: mockPistes,
        })));
        tick();
        expect(result.length).toEqual(2, 'should contain given amount of pistes');
        expect(result[0].name).toEqual('piste1', ' piste1 should be the found');
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

    it('insert(piste: Piste) should return true because it has created a piste', fakeAsync(() => {
        let result: boolean;
        const piste = new Piste('', '', '');
        this.pisteSpecificationService.insert(piste)
            .then((bool: boolean) => result = bool);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: true,
        })));
        tick();
        expect(result).toEqual(true, 'should contain given amount of pistes');
    }));

    it('insert method should query current service url', () => {
        const piste = new Piste('', '', '');
        this.pisteSpecificationService.insert(piste);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/piste\/create/, 'url invalid');
    });

    it('delete method should query current service url', () => {
        const piste = new Piste('', '', '');
        this.pisteSpecificationService.insert(piste);
        this.pisteSpecificationService.delete(piste);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/piste\/delete/, 'url invalid');
    });

    it('delete method should delete the object effectively', fakeAsync(() => {
        let deleted: boolean;
        const piste = new Piste('', '', '');
        this.pisteSpecificationService.insert(piste);
        this.pisteSpecificationService.delete(piste).then((bool: boolean) => deleted = bool);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: true,
        })));
        tick();
        expect(deleted).toEqual(true, 'should contain given amount of pistes');
    }));

    it('Update method should query current service url', () => {
        const pisteName = 'Piste1';
        const newPiste = new Piste('Champignonerie', ' ', ' ');
        this.pisteSpecificationService.update(newPiste, pisteName);
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/pisteScene\/update/, 'url invalid');
    });

    it('data should be updated effectively', fakeAsync(() => {
        let updated: boolean;
        const pisteName = 'Piste1';
        const newPiste = new Piste('piste1', 'easy', 'blabla');
        this.pisteSpecificationService.update(newPiste, pisteName).subscribe((bool: boolean) => updated = bool);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: true,
        })));
        tick();
        expect(updated).toEqual(true, 'should contain given amount of pistes');
    }));
});
