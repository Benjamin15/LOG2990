import { Position } from './Position';

const DISABLED_CLIENT = 'disabledClient';
const DISABLED_OTHER = 'disabledOther';
const DISABLED_BLACK = 'blackCase';
const DISABLED_MIX = 'disabledMix';
const CURSOR_CLIENT = 'cursorClient';
const CURSOR_OTHER = 'cursorOther';
const CURSOR_MIX = 'cursorMix';
const BLACK_CASE = '#';
const EMPTY_CASE = '.';
const EMPTY = '';

enum State {
    NONE, CLIENT, OTHER, MIX
}

export class Tile {
    public disabled: boolean;
    public cursor: State;
    public state: State;
    public style: string;

    constructor(public value: string, public tileLeft?: Tile, public tileRight?: Tile,
        public tileUp?: Tile, public tileDown?: Tile) {
        this.disabled = false;
        this.cursor = State.NONE;
        this.state = State.NONE;
        this.style = EMPTY;
    }

    public hasTileUp(): boolean {
        return this.tileUp !== undefined;
    }

    public hasTileDown(): boolean {
        return this.tileDown !== undefined;
    }

    public hasTileRight(): boolean {
        return this.tileRight !== undefined;
    }

    public hasTileLeft(): boolean {
        return this.tileLeft !== undefined;
    }

    public isBlock(): boolean {
        return this.value === BLACK_CASE;
    }

    public clear(): void {
        this.value = EMPTY_CASE;
    }

    public clearEmpty(): void {
        this.value = EMPTY;
    }

    public cursorClient(): void {
        if (!this.disabled) {
            if (this.cursor === State.NONE) {
                this.cursor = State.CLIENT;
                this.style = CURSOR_CLIENT;
            } else if (this.cursor === State.OTHER) {
                this.cursor = State.MIX;
                this.style = CURSOR_MIX;
            }
        }
    }

    public cursorOther(): void {
        if (!this.disabled) {
            if (this.cursor === State.NONE) {
                this.cursor = State.OTHER;
                this.style = CURSOR_OTHER;
            } else if (this.cursor === State.CLIENT) {
                this.cursor = State.MIX;
                this.style = CURSOR_MIX;
            }
        }
    }

    public cursorNoneClient(): void {
        if (!this.disabled && this.cursor === State.MIX) {
            this.cursor = State.OTHER;
            this.style = CURSOR_OTHER;
        } else if (!this.disabled) {
            this.cursor = State.NONE;
            this.style = EMPTY;
        }
    }

    public cursorNoneOther(): void {
        if (!this.disabled && this.cursor === State.MIX) {
            this.cursor = State.CLIENT;
            this.style = CURSOR_CLIENT;
        } else if (!this.disabled) {
            this.cursor = State.NONE;
            this.style = EMPTY;
        }
    }

    public disabledBlack(): void {
        this.style = DISABLED_BLACK;
        this.value = BLACK_CASE;
        this.disabled = true;
    }

    public disabledClient(): void {
        if (this.state === State.NONE) {
            this.state = State.CLIENT;
            this.disabled = true;
            this.style = DISABLED_CLIENT;
        } else if (this.state === State.OTHER) {
            this.state = State.MIX;
            this.style = DISABLED_MIX;
        }
    }

    public disabledOther(): void {
        if (this.state === State.NONE) {
            this.state = State.OTHER;
            this.disabled = true;
            this.style = DISABLED_OTHER;
        } else if (this.state === State.CLIENT) {
            this.state = State.MIX;
            this.style = DISABLED_MIX;
        }
    }

    public isFind(): boolean {
        return (this.style === DISABLED_CLIENT) || (this.style === DISABLED_OTHER) || (this.style === DISABLED_MIX);
    }

    public tileLeftIsBlock(): boolean {
        let succes = false;
        if (this.tileLeft === undefined) {
            succes = false;
        }
        else {
            succes = this.tileLeft.value === BLACK_CASE;
        }
        return succes;
    }

    public tileRightIsBlock(): boolean {
        let succes = false;
        if (this.tileLeft === undefined) {
            succes = false;
        }
        else {
            succes = this.tileRight.value === BLACK_CASE;
        }
        return succes;
    }

    public tileUpIsBlock(): boolean {
        let succes = false;
        if (this.tileUp === undefined) {
            succes = false;
        }
        else {
            succes = this.tileUp.value === BLACK_CASE;
        }
        return succes;
    }

    public copy(tile: Tile): void{
        this.cursor = tile.cursor;
        this.disabled = tile.disabled;
        this.state = tile.state;
        this.style = tile.style;
        this.value = tile.value;
    }
}
