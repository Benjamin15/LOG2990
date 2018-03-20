export class SizeError extends Error {
    
    constructor() {
        super ('size error');
    }
}

export class TryError extends Error {

    constructor() {
        super('try error');
    }
}

export class CancelError extends Error {

    constructor() {
        super ('cancel error');
    }
}

export class BadEndError extends Error {

    constructor() {
        super('bad end error');
    }
}