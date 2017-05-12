import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { CookieService } from 'ng2-cookies';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private _cookieService: CookieService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true

            if (this._cookieService.get("token") !== undefined) {
                return true;
            }

            localStorage.removeItem('currentUser');
            this.router.navigate(['/login'], { queryParams:{}});
            return false;
        }

       

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: {} });
        return false;
    }
}

