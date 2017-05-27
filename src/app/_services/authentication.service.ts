import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { CookieService } from 'ng2-cookies';
import { UserService } from '../_services/index';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private _cookieService: CookieService) { }

    login(email: string, password: string) {

        let headers = new Headers();
        let backendURL = 'http://localhost:3000/login';
         //let backendURL = 'https://meyespace-userservice.herokuapp.com/login';
        headers.append('Content-Type', 'application/json');

        let options = new RequestOptions({ headers: headers, withCredentials: true });

        return this.http.post(backendURL, JSON.stringify({ "email": email, "password": password }), options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response

                let jsonstring = JSON.parse(response["_body"]);
                let id = jsonstring["userId"];
                let country = jsonstring["country"];
                let username = jsonstring["userName"];
                let token = jsonstring["token"];
                let vaar = "remove this code here";
                this._cookieService.set("token", token, (new Date(Date.now() + (1000 * 3600 * 3)))); //3 hour

                if (token && id && country && username) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ id,token, country, username }));
                }
            });
    }

    logout() {

        if (localStorage.getItem('currentUser')) {
            var curr = JSON.parse(localStorage.getItem('currentUser'));
            let userService: UserService = new UserService(this.http);
            userService.logout(curr.id).subscribe(data => {

            });
        }
        localStorage.removeItem('currentUser');
        this._cookieService.delete('token');
        this._cookieService.delete('io');
        // remove user from local storage to log user out
    }
}