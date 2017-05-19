import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { User } from '../_models/index';
import { UserService, StatService, LiveDataService } from '../_services/index';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    global_leader_board: any[] = [];
    local_leader_board: any[] = [];

    showProfile: boolean = false;
    showFriends: boolean = false;
    showFindPlayer: boolean = false;
    showLeaderBoard: boolean = false;
    showGlobalChat: boolean = false;
    showLandingView: boolean = true;

    liveDataService: any = "";
   

    constructor(private http: Http, private userService: UserService, private statService: StatService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.liveDataService = new LiveDataService(this.currentUser.country);
    }

    changeMenu(menuitem) {

        this.showFindPlayer = (menuitem == "search") ? true : false;
        this.showProfile = (menuitem == "profile") ? true : false;
        this.showLeaderBoard = (menuitem == "leaderboard") ? true : false;
        this.showFriends = (menuitem == "friends") ? true : false;
        this.showGlobalChat = (menuitem == "globalchat") ? true : false;
        this.showLandingView = (menuitem == "home") ? true : false;
    }

    ngOnInit() {

        this.liveDataService.getLocalList(this.liveDataService).subscribe(data => {
            this.refreshLocalListUI(data);
        });

        this.liveDataService.getGlobalList(this.liveDataService).subscribe(data => {
            this.refreshGlobalListUI(data);
        });

        this.refreshGlobalListData();
        this.refreshLocalListData();


        this.refreshLocalRankData();
        this.refreshGlobalRankData();
    }

    refreshLocalRankData() {
        this.statService.getNationalRankById(this.currentUser.id).subscribe((data: any) => {
            this.refreshLocalRankingUI(data.score);
        });
    }

    refreshLocalRankingUI(score: number) {
        if (!isNaN(score) && isFinite(score)) {
            this.currentUser.localRank = score;
        }
        else {
            this.currentUser.localRank = NaN;
        }
    }

    refreshGlobalRankData() {
        this.statService.getGlobalRankById(this.currentUser.id).subscribe((data: any) => {
            this.refreshGlobalRankingUI(data.score);
        });
    }

    refreshGlobalRankingUI(score: number) {
        if (!isNaN(score) && isFinite(score)) {
            this.currentUser.globalRank = score;
        }
        else {
            this.currentUser.globalRank = NaN;
        }
    }

    refreshGlobalListData() {
        this.statService.getGlobalTopX(5).subscribe(data => {
            this.refreshGlobalListUI(data);
        });
    }

    refreshGlobalListUI(data: any) {

        this.global_leader_board = [];

        data.forEach((element: any) => {
            let global_entry: LeaderBoardEntry = new LeaderBoardEntry();
            global_entry.username = element.username;
            global_entry.score = element.score;
            this.global_leader_board.push(global_entry);
        });
    }

    refreshLocalListData() {
        this.statService.getNationalTopX(5, this.currentUser.country).subscribe(data => {
            this.refreshLocalListUI(data);
        });
    }

    refreshLocalListUI(data: any) {
        this.local_leader_board = [];

        data.forEach((element: any) => {
            let local_entry: LeaderBoardEntry = new LeaderBoardEntry();
            local_entry.username = element.username;
            local_entry.score = element.score;
            this.local_leader_board.push(local_entry);
        });
    }
}

class LeaderBoardEntry {
    username: string;
    score: number;
}
