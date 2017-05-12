import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
        private userService: UserService,
        private alertService: AlertService) { }        

    register() {
        this.loading = true;
        //$('#flagstrap-1f5Ao0Jo').val();
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
