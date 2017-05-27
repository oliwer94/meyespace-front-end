import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { User } from '../_models/index';
import { UserService, StatService, LiveDataService, ChatService } from '../_services/index';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    global_leader_board: any[] = [];
    local_leader_board: any[] = [];

    online_Friends: any = [];
    online_f_with_msg_status: any = [];

    conversations: any = [];
    activeConversation: any;

    showPrivateChatWindow: boolean = false;
    showProfile: boolean = false;
    showFriends: boolean = false;
    showFindPlayer: boolean = false;
    showLeaderBoard: boolean = false;
    showGlobalChat: boolean = false;
    showLandingView: boolean = true;
    notifications: any = [''];
    // liveDataService: any = "";

    constructor(private http: Http, private userService: UserService, private statService: StatService, private chatService: ChatService, private liveDataService: LiveDataService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //this.liveDataService = new LiveDataService(this.currentUser.country, this.currentUser.username);
        this.liveDataService.connectToGlobalAndCountry(this.currentUser.country, this.currentUser.username);
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

        this.chatService.registerToPrivate(this.chatService, this.currentUser.username);

        this.chatService.getPrivateMessages(this.chatService).subscribe((data: any) => {
            var convPartners = this.conversations.map(user => user.with);

            if (convPartners.includes(data.from)) {
                for (var i = 0; i < this.conversations.length; i++) {
                    if (data.from === this.conversations[i].with) {
                        this.conversations[i].messages.push(data.message);

                        if (this.activeConversation && this.activeConversation.with !== data.from) {
                            this.conversations[i].read = false;
                        }
                        break;
                    }
                }
            }
            else {
                var newConv = new PrivateConverstaion();
                newConv.with = data.from;
                newConv.messages = [data.message];
                newConv.read = false;
                this.conversations.push(newConv);
            }

            this.combineUnreadWithOnline();

        })

        this.refreshGlobalListData();
        this.refreshLocalListData();


        this.refreshLocalRankData();
        this.refreshGlobalRankData();

        this.getOnlineFriends();

        this.listenOnNewOnlineFriends();
        this.listenOnNewOfflineFriends();
    }

    notifClick() {
        if ($('.mdl-layout__drawer-right').hasClass('active')) {
            $('.mdl-layout__drawer-right').removeClass('active');
        }
        else {
            $('.mdl-layout__drawer-right').addClass('active');
        }
    }

    obfusClick() {
        if ($('.mdl-layout__drawer-right').hasClass('active')) {
            $('.mdl-layout__drawer-right').removeClass('active');
        }
        else {
            $('.mdl-layout__drawer-right').addClass('active');
        }
    }


    showChatPanel(name) {
        this.showPrivateChatWindow = true;
        var convPartners = this.conversations.map(user => user.with);

        if (convPartners.includes(name)) {
            for (var i = 0; i < this.conversations.length; i++) {
                if (name === this.conversations[i].with) {
                    this.activeConversation = this.conversations[i];
                    this.conversations[i].read = true;
                    break;
                }
            }
        }
        else {
            this.createNewConversation(name);
        }
        this.combineUnreadWithOnline();
    }

    hideChatPanel(value) {
        this.showPrivateChatWindow = false;
        this.activeConversation = [];
    }

    createNewConversation(name) {
        var newConv = new PrivateConverstaion();
        newConv.with = name;
        newConv.messages = [];
        newConv.read = true;
        this.conversations.push(newConv);
        this.activeConversation = newConv;
    }

    changeActiveConversation(name) {
        var mappedConv = this.conversations.filter(user => user.from === name)[0];
        this.activeConversation = mappedConv;
    }

    newPrivateMessage(message: any) {
        var mess = new Message();
        mess.text = message.text;
        mess.from = message.from;
        mess.createdAt = moment(moment.now()).format('h:mm a');

        for (var i = 0; i < this.conversations.length; i++) {
            if (this.activeConversation.with === this.conversations[i].with) {
                this.conversations[i].messages.push(mess);
                this.activeConversation = this.conversations[i];
                break;
            }
        }

        this.chatService.sendPrivateMessages(this.chatService, this.activeConversation.with, mess)
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
            this.combineUnreadWithOnline();
        });
    }

    combineUnreadWithOnline() {
        this.online_f_with_msg_status = [];
        var listOfUnreadConv = this.conversations.filter(conv => conv.read === false);
        if (listOfUnreadConv && listOfUnreadConv.length > 0) {
            var listOfUnreadUsers = listOfUnreadConv.map(conv => conv.with);
            this.online_Friends.forEach(element => {
                if (listOfUnreadUsers.includes(element))
                { this.online_f_with_msg_status.push({ element, "read": false }); }
                else
                { this.online_f_with_msg_status.push({ element, "read": true }); }

            });
        }
        else {
            this.online_Friends.forEach(element => {
                this.online_f_with_msg_status.push({ element, "read": true });
            });
        }
    }

    listenOnNewOnlineFriends() {
        this.liveDataService.getOnlineFriends(this.liveDataService).subscribe(data => {
            let index = this.online_Friends.indexOf(data);
            if (index === -1)
            { this.online_Friends.push(data); this.combineUnreadWithOnline(); }
        });
    }



    listenOnNewOfflineFriends() {
        this.liveDataService.getOfflineFriends(this.liveDataService).subscribe(data => {
            let index = this.online_Friends.indexOf(data);
            if (index > -1) {
                let deleted = this.online_Friends.splice(index, 1);
                let helper = this.online_Friends;
                this.online_Friends = helper;

                this.combineUnreadWithOnline();
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
        this.liveDataService.disconnect(this.liveDataService);
        this.chatService.disconnect(this.chatService);
    }
}

class LeaderBoardEntry {
    username: string;
    score: number;
}

class PrivateConverstaion {
    messages: Message[];
    with: string;
    read: boolean;
}
class Message {
    from: string;
    createdAt: any;
    text: string;
}
