"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
exports.pisteSchema = new mongoose_1.Schema({
    name: String,
    type: String,
    vignette: String,
    description: String,
    averageAppreciation: String,
    timesPlayed: String
});
exports.pisteSchema.pre("save", function (next) {
    next();
});
