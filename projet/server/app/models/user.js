"use strict";
exports.__esModule = true;
var UserModel = /** @class */ (function () {
    function UserModel(userModele) {
        this.userModele = userModele;
    }
    UserModel.prototype.getEmail = function () {
        return this.userModele.email;
    };
    UserModel.prototype.getPassword = function () {
        return this.userModele.password;
    };
    return UserModel;
}());
exports.UserModel = UserModel;
