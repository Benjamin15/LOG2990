"use strict";
exports.__esModule = true;
var user_1 = require("./schemas/user");
var mongoose = require('mongoose');
var Test = /** @class */ (function () {
    function Test() {
        this.url = 'mongodb://benjamin:150594@ds129344.mlab.com:29344/projet2';
        var connection = mongoose.createConnection(this.url, { useMongoClient: true }, function (error) {
            if (error) {
                console.log(error.message);
                console.log(error);
            }
            else {
                console.log('Connected to MongoDb');
            }
        });
        var user = connection.model("User", user_1.userSchema);
        this.data = {
            email: "test2@gmail.com",
            password: "test2mdp"
        };
        new user(this.data).save().then(function (result) {
            console.log(result);
        });
    }
    ;
    return Test;
}());
var test = new Test();
