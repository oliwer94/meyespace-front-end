import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/index';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    //baseUrl = 'https://meyespace-userservice.herokuapp.com';
    baseUrl = 'http://localhost:3000';

    logout(id: string) {
        return this.http.get(this.baseUrl + '/logout/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getCurrentUser(id: number) {
        return this.http.get(this.baseUrl + '/me/', this.jwt()).map((response: Response) => response.json());
    }

    getOnlineFriends(id: number) {
        return this.http.get(this.baseUrl + '/getOnlineFriends/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getFriends(id: number) {
        return this.http.get(this.baseUrl + '/getFriends/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getReceivedFriendRequests(id: number) {
        return this.http.get(this.baseUrl + '/getReceivedFriendRequests/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getSentFriendRequests(id: number) {
        return this.http.get(this.baseUrl + '/getSentFriendRequests/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.baseUrl + '/register', user, this.jwt()).map((response: Response) => response.json());
    }

    getUsersBySearchTerm(searchTerm: string, id: number) {
        return this.http.get(this.baseUrl + '/users/' + id + "/" + searchTerm, this.jwt()).map((response: Response) => response.json());
    }

    addFriend(id: string, username: string) {
        return this.http.post(this.baseUrl + '/addFriend/' + id, { username }, this.jwt()).map((response: Response) => response);
    }

    removeFriend(id: string, username: string) {
        return this.http.post(this.baseUrl + '/removeFriend/' + id, { username }, this.jwt()).map((response: Response) => response);
    }

    rejectFriend(id: string, username: string) {
        return this.http.post(this.baseUrl + '/rejectFriend/' + id, { username }, this.jwt()).map((response: Response) => response);
    }

    rewokeFriend(id: string, username: string) {
        return this.http.post(this.baseUrl + '/rewokeFriend/' + id, { username }, this.jwt()).map((response: Response) => response);
    }

    acceptFriend(id: string, username: string) {
        return this.http.post(this.baseUrl + '/acceptFriend/' + id, { username }, this.jwt()).map((response: Response) => response);
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({
                'Authorization': currentUser.token,
                'Content-Type': 'application/json'
            });
            return new RequestOptions({ headers: headers, withCredentials: true });
        }
    }
}