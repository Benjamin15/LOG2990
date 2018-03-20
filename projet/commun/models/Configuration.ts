import { IConfiguration } from './../interface/Configuration';
import { Player } from './Player';

export class Configuration implements IConfiguration {

    constructor(
        public nPlayer: number,
        public difficulty: string,
        public mode: string,
        public namePlayer?: string,
        public roomId?: string) { }
}
