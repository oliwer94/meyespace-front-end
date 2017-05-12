"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var core_2 = require("angular2-cookie/core");
var AuthenticationService = (function () {
    function AuthenticationService(http, _cookieService) {
        this.http = http;
        this._cookieService = _cookieService;
    }
    AuthenticationService.prototype.login = function (username, password) {
        var _this = this;
        var headers = new http_1.Headers();
        var backendURL = 'http://localhost:3000/login'; //'https://meyespace-userservice.herokuapp.com/login';
        headers.append('Content-Type', 'application/json');
        var options = new http_1.RequestOptions({ headers: headers, withCredentials: true });
        return this.http.post(backendURL, JSON.stringify({ "email": username, "password": password }), options)
            .map(function (response) {
            // login successful if there's a jwt token in the response
            var respObj = {};
            Object.keys(response).forEach(function (key) {
                respObj[key] = response[key];
            });
            var jsonstring = JSON.parse(response["_body"]);
            var id = _this._cookieService.get("userId");
            var country = jsonstring["country"];
            var username = jsonstring["userName"];
            var token = _this._cookieService.get("token");
            if (token && id && country && username) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify({ id: id, country: country, username: username }));
            }
        });
    };
    AuthenticationService.prototype.logout = function () {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, core_2.CookieService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map