import { IDefinition } from './../interface/Definition';
import { Position } from './../models/Position';

const EMPTY = '';
const DISABLED_CLIENT = 'disabledClient';
const DISABLED_OTHER = 'disabledOther';

export class Definition implements IDefinition {
    public disabled = false;
    public style: string;
    public positions: Array<Position>;
    public index: string;
    public word: string;
    public definition: string;
    public direction: string;

    constructor() {
        this.positions = new Array<Position>();
        this.index = EMPTY;
        this.word = EMPTY;
        this.definition = EMPTY;
    }

    public disabledClient(): void {
        this.disabled = true;
        this.style = DISABLED_CLIENT;
    }

    public disabledOther(): void {
        this.disabled = true;
        this.style = DISABLED_OTHER;
    }
}
