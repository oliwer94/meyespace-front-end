import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AlertService, UserService, StatService } from '../_services/index';
import * as $ from 'jquery';
var el: JQuery;

@Component({
    moduleId: module.id,
    selector: 'profile',
    templateUrl: 'profile.component.html'
})

export class ProfileComponent {
    currentUser: any;
    total_stats: any[] = [];
    onegame_stats: any[] = [];
    onelife_stats: any[] = [];
    userInfo: any[] = [];

    constructor(private statService: StatService, private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.statService.getStatsById(this.currentUser.id).subscribe(data => {
            this.populateTables(data);
        });
    }

    populateTables(data) {

        Object.keys(data.stat).forEach((key) => {

            if (key !== '_userId' && key !== '_id' && key !== '__v') {
                if (Array.isArray(data.stat[key])) {
                    /* body.statObj[key].forEach((element) => {
                         stat._doc[key].push(element);
                     });*/
                }
                else {
                    if (key.toLocaleLowerCase().indexOf("total") >= 0 || key.toLocaleLowerCase() === "longestgame") {
                        let global_entry: Stat = new Stat();
                        global_entry.statname = key;
                        global_entry.score = data.stat[key];
                        this.total_stats.push(global_entry);
                    }
                    else {

                        if (key.toLocaleLowerCase().indexOf("onegame") >= 0) {
                            let global_entry: Stat = new Stat();
                            global_entry.statname = key;
                            global_entry.score = data.stat[key];
                            this.onegame_stats.push(global_entry);
                        }
                        else {

                            if (key.toLocaleLowerCase().indexOf("onelife") >= 0) {
                                let global_entry: Stat = new Stat();
                                global_entry.statname = key;
                                global_entry.score = data.stat[key];
                                this.onelife_stats.push(global_entry);
                            }
                            else {

                                let global_entry: Stat = new Stat();
                                global_entry.statname = key;
                                global_entry.score = data.stat[key];
                                this.userInfo.push(global_entry);

                            }
                        }
                    }
                }
            }
        });
    }
}

class Stat {
    statname: string;
    score: number;
}
