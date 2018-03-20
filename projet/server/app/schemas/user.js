"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    email: String,
    password: String
});
exports.userSchema.pre("save", function (next) {
    next();
});
