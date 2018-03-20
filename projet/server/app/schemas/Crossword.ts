import { Schema } from 'mongoose';

export let crosswordSchema: Schema = new Schema({
    crossword: JSON,
});
crosswordSchema.pre('save', function (next) {
    next();
});
