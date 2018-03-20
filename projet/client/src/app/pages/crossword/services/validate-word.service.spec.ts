import { ValidateWordService } from './validate-word.service';
import { InitGameService } from './init-game.service';
import { Crossword } from './../../../../../../commun/models/Crossword';
import { assert } from 'chai';
import { Tile } from './../../../../../../commun/models/Tile';

describe('Validate word service', () => {

    const crossword = createCrossword();
    const initGameService = new InitGameService();
    const validateWordService = new ValidateWordService(this.Injector);

    it('should not valide word horizontal \'BONDOUR\'', () => {
        const localHorizontal = initGameService.initLocalHorizontal(crossword);
        const localVertical = initGameService.initLocalVertical(crossword);
        const localGrid = initGameService.initLocalGrid(crossword);
        validateWordService.initAttributs(localHorizontal, localVertical, crossword, localGrid);
        localGrid.tiles[0][0].value = 'B';
        localGrid.tiles[0][1].value = 'O';
        localGrid.tiles[0][2].value = 'N';
        localGrid.tiles[0][3].value = 'D';
        localGrid.tiles[0][4].value = 'O';
        localGrid.tiles[0][5].value = 'U';
        localGrid.tiles[0][6].value = 'R';
        validateWordService.checkWord(0, 0);
        const validation = (localHorizontal[0].disabled &&
            localGrid.tiles[0][0].disabled &&
            localGrid.tiles[0][1].disabled &&
            localGrid.tiles[0][2].disabled &&
            localGrid.tiles[0][3].disabled &&
            localGrid.tiles[0][4].disabled &&
            localGrid.tiles[0][5].disabled &&
            localGrid.tiles[0][6].disabled);
        assert(!validation);
    });

    it('should not valide word horizontal \'BAAAA\'', () => {
        const localHorizontal = initGameService.initLocalHorizontal(crossword);
        const localVertical = initGameService.initLocalVertical(crossword);
        const localGrid = initGameService.initLocalGrid(crossword);
        validateWordService.initAttributs(localHorizontal, localVertical, crossword, localGrid);
        localGrid.tiles[0][0].value = 'B';
        localGrid.tiles[1][0].value = 'A';
        localGrid.tiles[2][0].value = 'A';
        localGrid.tiles[3][0].value = 'A';
        localGrid.tiles[4][0].value = 'A';
        validateWordService.checkWord(0, 0);
        const validation = (localVertical[0].disabled &&
            localGrid.tiles[0][0].disabled &&
            localGrid.tiles[1][0].disabled &&
            localGrid.tiles[2][0].disabled &&
            localGrid.tiles[3][0].disabled &&
            localGrid.tiles[4][0].disabled);
        assert(!validation);
    });

});

function createCrossword(): Crossword {

    const crossword = new Crossword('classique', 'normal');
    const grill = [
        [new Tile('B'), new Tile('O'), new Tile('N'), new Tile('J'), new Tile('O'),
        new Tile('U'), new Tile('R'), new Tile('#'), new Tile('#'), new Tile('#')],
        [new Tile('O'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E'),
        new Tile('F'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('T'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E'),
        new Tile('F'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('T'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('E'),
        new Tile('F'), new Tile('#'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('E'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('#'),
        new Tile('#'), new Tile('G'), new Tile('H'), new Tile('I'), new Tile('J')],
        [new Tile('#'), new Tile('B'), new Tile('C'), new Tile('D'), new Tile('#'),
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
