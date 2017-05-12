import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { User } from '../_models/index';
import { UserService } from '../_services/index';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    global_scores: any[] = [];
    local_scores: any[] = [];

    private statUrl = "https://meyespace-statservice.herokuapp.com"
    private url = 'https://meyespace-livedataservice.herokuapp.com';

    /* private statUrl= "http://localhost:5000" ; 
     private url = 'http://localhost:6001';*/

    socket: any;

    constructor(private http: Http, private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.socket = io(this.url);
        this.socket.connect(this.url);
    }

    ngOnInit() {
        this.socket.emit('join', this.currentUser.country, (error: any) => {
            if (error) {
                alert("An error has occured please reload the page to try to reconnect! " + error);
            }
            console.log(`Connected to live data service. Listening on Global and ${this.currentUser.country} channels`);
        });

        this.socket.on('local', (data: any) => {
            this.refreshLocalList(data);
        });

        this.socket.on('global', (data: any) => {
            this.refreshGlobalList(data);
        });

        this.http.get(this.statUrl + "/global_top_x/5").subscribe((data: any) => {
            this.refreshGlobalList(JSON.parse(data._body));
        });

        this.http.get(this.statUrl + `/national_top_x/5/${this.currentUser.country}`).subscribe((data: any) => {
            this.refreshLocalList(JSON.parse(data._body));
        });

        this.http.get(this.statUrl + `/global_rank/${this.currentUser.id}`).subscribe((data: any) => {
            data = JSON.parse(data._body);
            console.log(data.score);
            if (!isNaN(parseFloat(data.score)) && isFinite(data.score)) {
                this.currentUser.globalRank = data.score;
            }
            else {
                this.currentUser.globalRank = NaN;
            }
        });

        this.http.get(this.statUrl + `/local_rank/${this.currentUser.id}`).subscribe((data: any) => {
            data = JSON.parse(data._body);
            console.log(data.score);
            if (!isNaN(parseFloat(data.score)) && isFinite(data.score)) {
                this.currentUser.localRank = data.score;
            }
            else {
                this.currentUser.localRank = NaN;
            }
        });
    }

    refreshGlobalList(data: any) {
        this.global_scores = [];

        data.forEach((element: any) => {
            this.global_scores.push(element.score);
        });
        //console.log('Global > ', data);
    }

    refreshLocalList(data: any) {
        this.local_scores = [];

        data.forEach((element: any) => {
            this.local_scores.push(element.score);
        });
        //console.log('Local > ', this.local_scores);
    }

    /*deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }*/

    /*sendMessage(message: any) {
        this.socket.emit('add-message', message);
    }

    getMessages() {
        let observable = new Observable(observer => {

            this.socket.on('message', (data: any) => {
                observer.next(data);
                console.log(data);
            });

            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }*/
}