"use strict";
exports.__esModule = true;
var list_1 = require("./schemas/list");
var mongoose = require('mongoose');
var ManageDatabase = /** @class */ (function () {
    function ManageDatabase() {
        this.url = 'mongodb://benjamin:150594@ds129344.mlab.com:29344/projet2';
        this.connection = mongoose.createConnection(this.url, { useMongoClient: true }, function (error) {
            if (error) {
                console.log(error.message);
                console.log(error);
            }
            else {
                console.log('Connected to MongoDb');
            }
        });
        this.userDoc = this.connection.model("Piste", list_1.pisteSchema);
    }
    ;
    ManageDatabase.prototype.insert = function (newUser) {
        this.userDoc.create(newUser).then(function (result) {
            console.log(result);
        });
    };
    ManageDatabase.prototype.find = function (userSearch) {
        this.userDoc.find(userSearch).then(function (result) {
            console.log(result);
            if (result.length === 1) {
                console.log("Identifiant bon");
            }
        });
    };
    ManageDatabase.prototype.insertPiste = function (newPiste) {
        this.userDoc.create(newPiste).then(function (result) {
            console.log(result);
        });
    };
    return ManageDatabase;
}());
var manager = new ManageDatabase();
var data = {
    name: 'piste2',
    type: 'moyen',
    vignette: 'lien2',
    description: 'blabla2',
    averageAppreciation: '4',
    timesPlayed: '2'
};
var dataFind = manager.insertPiste(data);
