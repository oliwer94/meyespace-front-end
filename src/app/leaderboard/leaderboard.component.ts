import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AlertService, UserService, StatService } from '../_services/index';
import * as $ from 'jquery';
var el: JQuery;

@Component({
    moduleId: module.id,
    selector: 'leaderboard',
    templateUrl: 'leaderboard.component.html',
    styleUrls: ['leaderboard.component.css']
})

export class LeaderBoardComponent {

    country: any;
    currentUser: any;
    globalLeaderBoard: any = [];
    localLeaderBoard: any = [];
    maxValueOfGlobal: any;
    maxValueOfLocal: any;

    currentPageGlobal: any;
    currentPageLocal: any;

    constructor(private statService: StatService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.country = this.currentUser.country;
        this.currentPageGlobal = 1;
        this.currentPageLocal = 1;

        this.maxValueOfGlobal = 100;
        this.maxValueOfLocal = 100;

        this.getPageNumbers();

        this.getGlobalLeaderBoard(this.currentPageGlobal);
        this.getLocalLeaderBoard(this.currentPageLocal);
    }

    isValid(val, max) {
        return (typeof val === 'number' && val > 0 && val <= max);
    }

    getPageNumbers() {
        this.statService.getPageNumbers(this.currentUser.country).subscribe(data => {
            this.maxValueOfGlobal = Math.floor((data.global / 10 > 1) ? data.global / 10 : 1);
            this.maxValueOfLocal = Math.floor((data.local / 10 > 1) ? data.local / 10 : 1);
            console.log(this.maxValueOfGlobal);
            console.log(this.maxValueOfLocal);
        });
    }

    getGlobalLeaderBoard(page) {
        if (page < 1) page = 1;
        if (page > this.maxValueOfGlobal) page = this.maxValueOfGlobal;
        var offset = (page === 1) ? 0 : page * 10;
        this.statService.getGlobalRankings(offset).subscribe(data => {
            this.globalLeaderBoard = data.data;
        });
    }

    getLocalLeaderBoard(page) {
        if (page < 1) page = 1;
        if (page > this.maxValueOfLocal) page = this.maxValueOfLocal;
        var offset = (page === 1) ? 0 : page * 10;
        this.statService.getLocalRankings(offset, this.currentUser.country).subscribe(data => {
            this.localLeaderBoard = data.data;
        });
    }

    nextLocalPage() {
        this.currentPageLocal = this.currentPageLocal + 1;
        this.getLocalLeaderBoard(this.currentPageLocal);
    }

    previousLocalPage() {
        this.currentPageLocal = this.currentPageLocal - 1;
        this.getLocalLeaderBoard(this.currentPageLocal);
    }

    firstLocalPage() {
        this.currentPageLocal = 1;
        this.getLocalLeaderBoard(this.currentPageLocal);
    }

    lastLocalPage() {
        this.currentPageLocal = this.maxValueOfLocal;
        this.getLocalLeaderBoard(this.currentPageLocal);
    }

    goToLocalPage(pageNo) {
        if (this.isValid(Number.parseFloat(pageNo), this.maxValueOfLocal)) {
            this.currentPageLocal = pageNo;
            this.getLocalLeaderBoard(this.currentPageLocal);
        }
    }

    nextGlobalPage() {
        this.currentPageGlobal = this.currentPageGlobal + 1;
        this.getGlobalLeaderBoard(this.currentPageGlobal);
    }

    previousGlobalPage() {
        this.currentPageGlobal = this.currentPageGlobal - 1;
        this.getGlobalLeaderBoard(this.currentPageGlobal);
    }

    firstGlobalPage() {
        this.currentPageGlobal = 1;
        this.getGlobalLeaderBoard(this.currentPageGlobal);
    }

    lastGlobalPage() {
        this.currentPageGlobal = this.maxValueOfGlobal;
        this.getGlobalLeaderBoard(this.currentPageGlobal);
    }

    goToGlobalPage(pageNo) {
        if (this.isValid(Number.parseFloat(pageNo), this.maxValueOfGlobal)) {
            this.currentPageGlobal = pageNo;
            this.getGlobalLeaderBoard(this.currentPageGlobal);
        }
    }

}