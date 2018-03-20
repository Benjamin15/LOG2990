import { IPisteModel } from './../../server/app/interface/model';
import { IPiste } from './../interface/Piste';
import { Time } from './../models/Time';

export class PisteModel {
    private userModele: IPiste;

    constructor(userModele: IPisteModel) {
        this.userModele = userModele;
    }
}

export class Piste implements IPiste {

    constructor(public name: string, public type: string, public description: string,
        public vignette?: string, public circuit?: string, public averageAppreciation?: number[],
        public timesPlayes?: string, public bestTimes?: string, public speedBonuses?: string,
        public potholes?: string, public puddles?: string) {
    }
}