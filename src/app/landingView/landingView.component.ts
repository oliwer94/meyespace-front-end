import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AlertService, UserService } from '../_services/index';
import * as $ from 'jquery';
var el: JQuery;

@Component({
    moduleId: module.id,
    selector: 'landingView',
    templateUrl: 'landingView.component.html',
    styleUrls: ['landingView.component.css']
})

export class LandingViewComponent {


}