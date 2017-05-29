import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AlertService, UserService } from '../_services/index';
import * as $ from 'jquery';
var el: JQuery;

@Component({
    moduleId: module.id,
    selector: 'friends',
    templateUrl: 'friends.component.html',
    styleUrls: ['friends.component.css','../profile/profile.component.css']
})

export class FriendsComponent {


    friendList: any = [];
    sentList: any = [];
    receivedList: any = [];
    currentUser: any;

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.getFriends();
        this.getReceivedFriendRequests();
        this.getSentFriendRequests();
    }

    getFriends() {
        this.userService.getFriends(this.currentUser.id).subscribe((data: any) => {

            this.friendList = [];
            data.friendList.forEach(element => {
                this.friendList.push(element);
            });
        });
    }

    getReceivedFriendRequests() {
        this.userService.getReceivedFriendRequests(this.currentUser.id).subscribe((data: any) => {

            this.receivedList = [];
            data.receivedList.forEach(element => {
                this.receivedList.push(element);
            });
        });
    }

    getSentFriendRequests() {
        this.userService.getSentFriendRequests(this.currentUser.id).subscribe((data: any) => {
            this.sentList = data.sentList;
        });
    }


    removeFriend(username) {
        this.userService.removeFriend(this.currentUser.id, username).subscribe((data: any) => {
            this.getFriends();
        });
    }

    rejectFriend(username) {
        this.userService.rejectFriend(this.currentUser.id, username).subscribe((data: any) => {
            this.getReceivedFriendRequests();
        });
    }

    rewokeFriend(username) {
        this.userService.rewokeFriend(this.currentUser.id, username).subscribe((data: any) => {
            this.getSentFriendRequests();
        });
    }

    acceptFriend(username) {
        this.userService.acceptFriend(this.currentUser.id, username).subscribe((data: any) => {
            this.getFriends();
            this.getReceivedFriendRequests();
        });
    }

    isComp1On: boolean = true;
    isComp2On: boolean = false;

}