import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AlertService, UserService } from '../_services/index';
import * as $ from 'jquery';
var el: JQuery;

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private http: Http,
        private userService: UserService,
        private alertService: AlertService) {

        let headers = new Headers();
        let backendURL = /*'http://localhost:3000/login'//*/'https://meyespace-userservice.herokuapp.com/login';
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        let options = new RequestOptions({ headers: headers });

        this.http.get("http://meyespace-frontens.com/getCountry").subscribe((data: any) => {
            this.model.country = data.country;
        })
    }


    register() {
        this.loading = true;
        navigator.geolocation.getCurrentPosition(function (position) {
            alert(position.coords);
        });
        this.userService.create(this.model)
            .subscribe(
            data => {
                this.alertService.success('Registration successful. Please check you emails to verify your account!', true);
                this.router.navigate(['/login']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}