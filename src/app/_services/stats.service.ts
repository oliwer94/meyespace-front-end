import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class StatService {
    constructor(private http: Http) { }

    //private statUrl = "https://meyespace-statservice.herokuapp.com";

    private statUrl = "http://localhost:5000";

    getGlobalTopX(number: number) {

        return this.http.get(this.statUrl + `/global_top_x/${number}`, this.jwt()).map((response: Response) => response.json());
    }

    getNationalTopX(number: number, country: string) {

        return this.http.get(this.statUrl + `/national_top_x/${number}/${country}`, this.jwt()).map((response: Response) => response.json());
    }

    getGlobalRankById(id: number) {
        return this.http.get(this.statUrl + `/global_rank/${id}`, this.jwt()).map((response: Response) => response.json());
    }

    getNationalRankById(id: number) {
        return this.http.get(this.statUrl + `/local_rank/${id}`, this.jwt()).map((response: Response) => response.json());
    }

    getStatsById(id: number) {
        return this.http.get(this.statUrl + `/stat/${id}`, this.jwt()).map((response: Response) => response.json());
    }

    getLocalRankings(offset: number, country: string) {
        return this.http.get(this.statUrl + `/local_rankings/${country}/${offset}`, this.jwt()).map((response: Response) => response.json());
    }

    getGlobalRankings(offset: number) {
        return this.http.get(this.statUrl + `/global_rankings/${offset}`, this.jwt()).map((response: Response) => response.json());
    }

    getPageNumbers(country: String) {
        return this.http.get(this.statUrl + `/page_numbers/${country}`, this.jwt()).map((response: Response) => response.json());
    }

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({
                'Authorization': 'Bearer ' + currentUser.token,
                'Content-Type': 'application/json',
                'token':currentUser.token
            });
            return new RequestOptions({ headers: headers, withCredentials: true });
        }
    }
}