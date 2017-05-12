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
var index_1 = require("../_services/index");
var io = require("socket.io-client");
var HomeComponent = (function () {
    function HomeComponent(http, userService) {
        this.http = http;
        this.userService = userService;
        this.users = [];
        this.global_scores = [];
        this.local_scores = [];
        this.statUrl = "https://meyespace-statservice.herokuapp.com";
        this.url = 'https://meyespace-livedataservice.herokuapp.com';
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.socket = io(this.url);
        this.socket.connect(this.url);
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.socket.emit('join', this.currentUser.country, function (error) {
            if (error) {
                alert("An error has occured please reload the page to try to reconnect! " + error);
            }
            console.log("Connected to live data service. Listening on Global and " + _this.currentUser.country + " channels");
        });
        this.socket.on('local', function (data) {
            _this.refreshLocalList(data);
        });
        this.socket.on('global', function (data) {
            _this.refreshGlobalList(data);
        });
        this.http.get(this.statUrl + "/global_top_x/5").subscribe(function (data) {
            _this.refreshGlobalList(JSON.parse(data._body));
        });
        this.http.get(this.statUrl + ("/national_top_x/5/" + this.currentUser.country)).subscribe(function (data) {
            _this.refreshLocalList(JSON.parse(data._body));
        });
        this.http.get(this.statUrl + ("/global_rank/" + this.currentUser.id)).subscribe(function (data) {
            data = JSON.parse(data._body);
            console.log(data.score);
            if (!isNaN(parseFloat(data.score)) && isFinite(data.score)) {
                _this.currentUser.globalRank = data.score;
            }
            else {
                _this.currentUser.globalRank = NaN;
            }
        });
        this.http.get(this.statUrl + ("/local_rank/" + this.currentUser.id)).subscribe(function (data) {
            data = JSON.parse(data._body);
            console.log(data.score);
            if (!isNaN(parseFloat(data.score)) && isFinite(data.score)) {
                _this.currentUser.localRank = data.score;
            }
            else {
                _this.currentUser.localRank = NaN;
            }
        });
    };
    HomeComponent.prototype.refreshGlobalList = function (data) {
        var _this = this;
        this.global_scores = [];
        data.forEach(function (element) {
            _this.global_scores.push(element.score);
        });
        //console.log('Global > ', data);
    };
    HomeComponent.prototype.refreshLocalList = function (data) {
        var _this = this;
        this.local_scores = [];
        data.forEach(function (element) {
            _this.local_scores.push(element.score);
        });
        //console.log('Local > ', this.local_scores);
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'home.component.html',
    }),
    __metadata("design:paramtypes", [http_1.Http, index_1.UserService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map