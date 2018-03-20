import { QueryList, ElementRef } from '@angular/core';
import { Board } from './../../../../../../commun/models/Board';

const RIGHT = 'ArrowRight';
const LEFT = 'ArrowLeft';
const DOWN = 'ArrowDown';
const UP = 'ArrowUp';
const NEXT = 1;

export class MovementService {

    private localGrid: Board;
    private cells: QueryList<ElementRef>;

    public initAttributs(localGrid: Board, cells: QueryList<ElementRef>): void {
        this.localGrid = localGrid;
        this.cells = cells;
    }

    public focus(i: number, j: number): void {
        const id = Number.parseInt(i.toString() + j.toString());
        this.cells.toArray()[id].nativeElement.focus();
    }

    public goBlockTop(i: number, j: number): void {
        const stop = -this.localGrid.tiles.length;
        for (i; i >= 0; i--) {
            if (this.tileNotValide(i, j)) {
                i = stop;
            }
        }
    }

    public goBlockDown(i: number, j: number): void {
        const stop = this.localGrid.tiles.length;
        for (i; i < this.localGrid.tiles.length; i++) {
            if (this.tileNotValide(i, j)) {
                i = stop;
            }
        }
    }

    public goBlockLeft(i: number, j: number): void {
        const stop = -this.localGrid.tiles.length;
        for (j; j >= 0; j--) {
            if (this.tileNotValide(i, j)) {
                j = stop;
            }
        }
    }

    public goBlockRight(i: number, j: number): void {
        const stop = this.localGrid.tiles.length;
        for (j; j < this.localGrid.tiles.length; j++) {
            if (this.tileNotValide(i, j)) {
                j = stop;
            }
        }
    }

    public tileNotValide(i: number, j: number): boolean {
        const tile = this.localGrid.tiles[i][j];
        if (tile.isBlock()) {
            return true;
        }
        if (!tile.disabled) {
            this.focus(i, j);
            return true;
        }
        return false;
    }

    public keyboardMovement(mouvement: string, i: number, j: number): void {
        if (mouvement === UP) {
            this.goBlockTop(i - NEXT, j);
        } else if (mouvement === DOWN) {
            this.goBlockDown(i + NEXT, j);
        } else if (mouvement === LEFT) {
            this.goBlockLeft(i, j - NEXT);
        } else if (mouvement === RIGHT) {
            this.goBlockRight(i, j + NEXT);
        }
    }
}
