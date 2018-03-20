import { ITime } from './../interface/Time';

export class Time implements ITime {
    constructor(
        public time: string,
        public name: string
    ) { }
}