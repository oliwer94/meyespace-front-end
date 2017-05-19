import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AlertService, UserService, AuthenticationService } from '../_services/index';
import * as $ from 'jquery';

var el: JQuery;

@Component({
    moduleId: module.id,
    selector: 'loginAndRegister',
    templateUrl: 'loginAndRegister.component.html',
    styleUrls: ['loginAndRegister.component.css']
})

export class LoginAndRegisterComponent implements OnInit {

    registerModel: any = {};
    loginModel: any = {};
    loading = false;
    returnUrl: string;

    constructor(

        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private router: Router,
        private http: Http,
        private userService: UserService,
        private alertService: AlertService) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let options = new RequestOptions({ headers: headers });
        //let url = "http://localhost:8080/getCountry";
        let url = "https://meyespace-livedataservice.herokuapp.com/getCountry";
        this.http.get(url, options).subscribe((data: any) => {
            this.registerModel.country = data._body;
        })
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.loginModel.email, this.loginModel.password)
            .subscribe(
            data => {
                //  this.router.navigate(['/login'], { queryParams: {} });
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    register() {
        this.loading = true;
        
        this.userService.create(this.registerModel)
            .subscribe(
            data => {
                this.alertService.success('Registration successful. Please check you emails to verify your account!', true);
                this.backClick();
               // this.router.navigate(['/login']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    loginClick() {
        $(".signIn").addClass("active-dx");
        $(".signUp").addClass("inactive-sx");
        $(".signUp").removeClass("active-sx");
        $(".signIn").removeClass("inactive-dx");
    }

    backClick() {
        $(".signUp").addClass("active-sx");
        $(".signIn").addClass("inactive-dx");
        $(".signIn").removeClass("active-dx");
        $(".signUp").removeClass("inactive-sx");
    }
}