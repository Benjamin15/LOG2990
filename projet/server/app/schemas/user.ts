import { Schema } from 'mongoose';

export let userSchema: Schema = new Schema({
    email: String,
    password: String
});
userSchema.pre('save', function (next) {
    next();
});
