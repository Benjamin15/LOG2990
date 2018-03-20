
const FUNCTION = 'function';
const KEY_MODEL = 'xxxxxxxx-xxxx-5xxx-yxxx-yyyy';
const X = 'x';
const HEXA = 16;
const MASK_AND = 0x3;
const MASK_OR = 0x8;

export class KeyGen {

    public static generateUUID(): string {
        let date = new Date().getTime();

        let uuid = KEY_MODEL.replace(/[xy]/g, (letter) => {
            let random = (date + Math.random() * HEXA) % HEXA | 0;
            date = Math.floor(date / HEXA);
            return (letter == X ? random : (random & MASK_AND | MASK_OR)).toString(HEXA);
        });
        return uuid;
    }
}