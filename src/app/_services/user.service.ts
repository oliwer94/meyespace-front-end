import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/index';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    //baseUrl = 'https://meyespace-userservice.herokuapp.com';
    baseUrl = 'http://localhost:3000';

    logout(id:string) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.baseUrl + '/logout/'+id, options).map((response: Response) => response.json());
    }

    getCurrentUser(id: number) {
        return this.http.get(this.baseUrl + '/me/', this.jwt()).map((response: Response) => response.json());
    }

    getOnlineFriends(id: number) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.baseUrl + '/getOnlineFriends/' + id, options).map((response: Response) => response.json());
    }

    getFriends(id: number) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.baseUrl + '/getFriends/' + id, options).map((response: Response) => response.json());
    }

    getReceivedFriendRequests(id: number) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.baseUrl + '/getReceivedFriendRequests/' + id, options).map((response: Response) => response.json());
    }

    getSentFriendRequests(id: number) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.baseUrl + '/getSentFriendRequests/' + id, options).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.baseUrl + '/register', user, this.jwt()).map((response: Response) => response.json());
    }

    getUsersBySearchTerm(searchTerm: string, id: number) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.baseUrl + '/users/' + id + "/" + searchTerm, options).map((response: Response) => response.json());
    }

    addFriend(id: string, username: string) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.post(this.baseUrl + '/addFriend/' + id, { username }, options).map((response: Response) => response);
    }

    removeFriend(id: string, username: string) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.post(this.baseUrl + '/removeFriend/' + id, { username }, options).map((response: Response) => response);
    }

    rejectFriend(id: string, username: string) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.post(this.baseUrl + '/rejectFriend/' + id, { username }, options).map((response: Response) => response);
    }

    rewokeFriend(id: string, username: string) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.post(this.baseUrl + '/rewokeFriend/' + id, { username }, options).map((response: Response) => response);
    }

    acceptFriend(id: string, username: string) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.post(this.baseUrl + '/acceptFriend/' + id, { username }, options).map((response: Response) => response);
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers, withCredentials: true });
        }
    }
}