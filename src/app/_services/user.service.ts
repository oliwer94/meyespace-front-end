﻿import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/index';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    //baseUrl = 'https://meyespace-userservice.herokuapp.com';
    baseUrl = 'http://localhost:3000';

    getAll() {
        return this.http.get(this.baseUrl + '/users', this.jwt()).map((response: Response) => response.json());
    }

    getCurrentUser(id: number) {
        return this.http.get(this.baseUrl + '/me/', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.baseUrl + '/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.baseUrl + '/register', user, this.jwt()).map((response: Response) => response.json());
    }

   

    /*update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }*/

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}