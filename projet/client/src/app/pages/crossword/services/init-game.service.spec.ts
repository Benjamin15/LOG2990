import { InitGameService } from './init-game.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Tile } from './../../../../../../commun/models/Tile';
import { Crossword } from './../../../../../../commun/models/Crossword';
import { Definition } from './../../../../../../commun/models/Definition';

describe('MockBackend Grill manager', () => {
    let crossword: Crossword;
    let grillLocal: Array<Array<string>>;
    let definitionHorizontal: Array<Definition>;
    let definitionVertical: Array<Definition>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [InitGameService]
        }).compileComponents();

        this.injector = ReflectiveInjector.resolveAndCreate([
            { provide: ConnectionBackend, useClass: MockBackend },
            { provide: RequestOptions, useClass: BaseRequestOptions },
            Http, InitGameService,
        ]);
        this.crosswordCreateGameService = this.injector.get(InitGameService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
        crossword = createCrossword();
    });

    it('should initialize grill local', fakeAsync(() => {
        grillLocal = this.crosswordCreateGameService.initLocalGrid(crossword);
        expect(grillLocal);
    }));

    it('should verify length column grill', fakeAsync(() => {
        expect(grillLocal.length === 10).toBe(true);
    }));

    it('should verify grill is full', fakeAsync(() => {
        let succes = true;
        crossword.board.tiles.forEach(tiles => {
            tiles.forEach(tile => {
                if (tile.value === '.') {
                    succes = false;
                }
            });
        });
        expect(succes).toBe(true);
    }));

    it('should verify grill receive line length ', fakeAsync(() => {
        let succes = true;
        crossword.board.tiles.forEach(values => {
            if (values.length !== 10) {
                succes = false;
            }
        });
        expect(succes).toBe(true);
    }));

    it('should verify length definition horizontal', fakeAsync(() => {
        definitionHorizontal = this.crosswordCreateGameService.initLocalHorizontal(crossword);
        expect(true).toBe(true);
    }));

    it('should verify definition horizontal load', fakeAsync(() => {
        expect(definitionHorizontal.length === crossword.definitionsLine.length).toBe(true);
    }));

    it('should verify length definition vertical', fakeAsync(() => {
        definitionVertical = this.crosswordCreateGameService.initLocalVertical(crossword);
        expect(true).toBe(true);
    }));

    it('should verify definition vertical load', fakeAsync(() => {
        expect(definitionVertical.length === crossword.definitionsColumn.length).toBe(true);
    }));

    it('should get a response crossword create grill', fakeAsync(() => {
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

function createCrossword(): Crossword {

    const crossword = new Crossword('classique', 'normal');
    const grill = [
        [new Tile('A'), new Tile('B'), new Tile('E'), new Tile('I'), new Tile('L'),
        new Tile('L'), new Tile('E'), new Tile('H'), new Tile('I'), new Tile('#')],
        [new Tile('A'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E'),
        new Tile('F'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('A'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E'),
        new Tile('F'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('A'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E'),
        new Tile('F'), new Tile('#'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('A'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('#'),
        new Tile('#'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('A'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('#'),
        new Tile('#'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('A'), new Tile('B'), new Tile('C'), new Tile('#'), new Tile('E'),
        new Tile('F'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('A'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E'),
        new Tile('F'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('A'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E'),
        new Tile('F'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('#'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E'),
        new Tile('F'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
    ];
    crossword.board.tiles = grill;
    crossword.definitionsLine =
        [
            '1',
            '2',
            '3',
            '4-1',
            '4-2',
            '5-1',
            '5-2',
            '6-1',
            '6-2',
            '7-1',
            '7-2',
            '8',
            '9',
            '10'
        ];
    crossword.definitionsColumn = [
        '1',
        '2',
        '3',
        '4-1',
        '4-2',
        '5-1',
        '5-2',
        '6-1',
        '6-2',
        '7-1',
        '7-2',
        '8',
        '9',
        '10'
    ];
    return crossword;
}
