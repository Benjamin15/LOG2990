import { Schema } from 'mongoose';

export let pisteSchema: Schema = new Schema({
    name: String,
    type: String,
    vignette: String,
    circuit: String,
    description: String,
    averageAppreciation: { type: Array, 'default': [] },
    timesPlayed: String,
    bestTimes: String,
    speedBonuses: String,
    potholes: String,
    puddles: String
});
pisteSchema.pre('save', function (next) {
    next();
});
