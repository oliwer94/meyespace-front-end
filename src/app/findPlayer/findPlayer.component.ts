import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AlertService, UserService } from '../_services/index';
import * as $ from 'jquery';
var el: JQuery;

@Component({
    moduleId: module.id,
    selector: 'findPlayer',
    templateUrl: 'findPlayer.component.html',
    styleUrls: ['../profile/profile.component.css','../friends/friends.component.css']
})

export class FindPlayerComponent {

    // searchTerm: any = "";
    results: any = [];
    currentUser: any;
    search: string;

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    getUsersBySearchTerm(searchTerm: string) {

        if (searchTerm.length >= 3) {
            this.search = searchTerm;
            this.userService.getUsersBySearchTerm(searchTerm, this.currentUser.id).subscribe((data: any) => {

                this.results = [];
                data.listOfUsers.forEach(element => {
                    this.results.push(element);
                });
            });
        }
    }

    addFriend(username) {
        this.userService.addFriend(this.currentUser.id, username).subscribe((data: any) => {
            this.getUsersBySearchTerm(this.search);
        });
    }

    removeFriend(username) {
        this.userService.removeFriend(this.currentUser.id, username).subscribe((data: any) => {
            this.getUsersBySearchTerm(this.search);
        });
    }

    rejectFriend(username) {
        this.userService.rejectFriend(this.currentUser.id, username).subscribe((data: any) => {
            this.getUsersBySearchTerm(this.search);
        });
    }

    rewokeFriend(username) {
        this.userService.rewokeFriend(this.currentUser.id, username).subscribe((data: any) => {
            this.getUsersBySearchTerm(this.search);
        });
    }

    acceptFriend(username) {
        this.userService.acceptFriend(this.currentUser.id, username).subscribe((data: any) => {
            this.getUsersBySearchTerm(this.search);
        });
    }
}