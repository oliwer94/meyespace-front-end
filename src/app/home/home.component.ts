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

    online_Friends: any = ["oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer", "oliwer"];

    showProfile: boolean = false;
    showFriends: boolean = false;
    showFindPlayer: boolean = false;
    showLeaderBoard: boolean = false;
    showGlobalChat: boolean = false;
    showLandingView: boolean = true;
    notifications: any = ["Oliwer has reached RANK 5 in Hungary", "Oliwer has reached RANK 5 in Global", "Oliwer has sent you a friend request", "Oliwer has declined your friend request", "Oliwer accepted your Friends Request", "Oliwer has declined your friend request", "Oliwer accepted your Friends Request",];
    liveDataService: any = "";



    constructor(private http: Http, private userService: UserService, private statService: StatService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.liveDataService = new LiveDataService(this.currentUser.country, this.currentUser.username);
    }

    changeMenu(menuitem) {
        this.showGlobalChat = (menuitem === "globalchat") ? true : false;
        this.showLandingView = (menuitem === "home") ? true : false;
        this.showProfile = (menuitem === "profile") ? true : false;
        this.showFriends = (menuitem === "friends") ? true : false;
        this.showFindPlayer = (menuitem === "search") ? true : false;
        this.showLeaderBoard = (menuitem === "leaderboard") ? true : false;
    }



    ngOnInit() {

        this.liveDataService.getLocalList(this.liveDataService).subscribe(data => {
            this.generateNotification(this.local_leader_board, data, this.currentUser.country);
            this.refreshLocalListUI(data);
        });

        this.liveDataService.getGlobalList(this.liveDataService).subscribe(data => {
            this.generateNotification(this.global_leader_board, data, "Global");
            this.refreshGlobalListUI(data);
        });

        this.liveDataService.getNotifications(this.liveDataService).subscribe(data => {
            this.notifications.unshift(data);
        });

        this.refreshGlobalListData();
        this.refreshLocalListData();


        this.refreshLocalRankData();
        this.refreshGlobalRankData();

        this.getOnlineFriends();

        this.listenOnNewOnlineFriends();
        this.listenOnNewOfflineFriends();
    }

    generateNotification(old_list, new_list, country) {
        if (old_list.length === new_list.length) {
            for (var i = 0; i < 5; i++) {
                if (old_list[i].name != new_list[i].name || old_list[i].score != new_list[i].score) {
                    let username = new_list[i].username;
                    let score = new_list[i].score;
                    this.notifications.unshift(`${username} has reach rank ${i + 1} in the ${country} rankings with the score: ${score}pt `);
                    break;
                }
            }
        }
        else if (this.local_leader_board === []) {
            let username = new_list[0].username;
            let score = new_list[0].score;
            this.notifications.unshift(`${username} has reach rank 1 in the ${country} rankings with the score: ${score}pt `);
        }
        else if (new_list.length > old_list.length) {
            for (var i = 0; i < old_list.length; i++) {
                if (old_list[i].name != new_list[i].name || old_list[i].score != new_list[i].score) {
                    let username = new_list[i].username;
                    let score = new_list[i].score;
                    this.notifications.unshift(`${username} has reach rank ${i + 1} in the ${country} rankings with the score: ${score}pt `);
                    break;
                }
                else if ((i + 1) === old_list.length) {
                    let username = new_list[i + 1].username;
                    let score = new_list[i + 1].score;
                    this.notifications.unshift(`${username} has reach rank ${i + 2} in the ${country} rankings with the score: ${score}pt `);
                }
            }
        }
    }

    getOnlineFriends() {
        this.userService.getOnlineFriends(this.currentUser.id).subscribe(data => {
            this.online_Friends = data.onlineFriends;
        });
    }

    listenOnNewOnlineFriends() {
        this.liveDataService.getOnlineFriends(this.liveDataService).subscribe(data => {
            let index = this.online_Friends.indexOf(data);
            if (index === -1)
            { this.online_Friends.push(data); }
        });
    }

    listenOnNewOfflineFriends() {
        this.liveDataService.getOfflineFriends(this.liveDataService).subscribe(data => {
            let index = this.online_Friends.indexOf(data);
            if (index > -1) {
                let deleted = this.online_Friends.splice(index, 1);
                let helper = this.online_Friends;
                this.online_Friends = helper;
            }
        });
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

    disconnect() {
        this.liveDataService.disconnect();
    }
}

class LeaderBoardEntry {
    username: string;
    score: number;
}
