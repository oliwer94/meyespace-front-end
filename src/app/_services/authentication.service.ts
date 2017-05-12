import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { CookieService } from 'ng2-cookies';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private _cookieService: CookieService) { }



    login(username: string, password: string) {

        let headers = new Headers();
        let backendURL = /*'http://localhost:3000/login'//*/'https://meyespace-userservice.herokuapp.com/login';
        headers.append('Content-Type', 'application/json');


        let options = new RequestOptions({ headers: headers, withCredentials: true });

        return this.http.post(backendURL, JSON.stringify({ "email": username, "password": password }), options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response

                let jsonstring = JSON.parse(response["_body"]);
                let id = jsonstring["userId"];
                let country = jsonstring["country"];
                let username = jsonstring["userName"];
                let token =jsonstring["token"];
                this._cookieService.set("token",token,new Date(Date.now() + 60000));

                if (token && id && country && username) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ id, country, username }));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}