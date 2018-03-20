import { Schema } from 'mongoose';

export let wordSchema: Schema = new Schema({
    orthograhy: String,
});
wordSchema.pre('save', function (next) {
    next();
});
