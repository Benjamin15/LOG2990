export class Key {

    private pressed;

    constructor() {
        const size = 256;
        this.pressed = new Array<boolean>(size);
    }
    public isDown(keyCode: number): boolean {
        return this.pressed[keyCode];
    }

    public onKeyDown(keyCode: number): void {
        this.pressed[keyCode] = true;
    }

    public onKeyUp(keyCode: number): void {
        this.pressed[keyCode] = false;
    }
}
