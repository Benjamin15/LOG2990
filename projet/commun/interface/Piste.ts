import { Time } from './../models/Time';

export interface IPiste {
    name?: string;
    type?: string;
    vignette?: string;
    description?: string;
    circuit?: string;
    averageAppreciation?: number[];
    timesPlayed?: string;
    bestTimes?: string;
    speedBonuses?: string;
    puddles?: string;
    potholes?: string;
}
