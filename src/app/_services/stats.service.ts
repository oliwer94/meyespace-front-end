import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class StatService {
    constructor(private http: Http) { }

    //private statUrl = "https://meyespace-statservice.herokuapp.com";

    private statUrl = "http://localhost:5000";

    getGlobalTopX(number: number) {

        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.statUrl + `/global_top_x/${number}`, options).map((response: Response) => response.json());
    }

    getNationalTopX(number: number, country: string) {

        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.statUrl + `/national_top_x/${number}/${country}`, options).map((response: Response) => response.json());
    }

    getGlobalRankById(id: number) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.statUrl + `/global_rank/${id}`, options).map((response: Response) => response.json());
    }

    getNationalRankById(id: number) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.statUrl + `/local_rank/${id}`, options).map((response: Response) => response.json());
    }

    getStatsById(id: number) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.statUrl + `/stat/${id}`, options).map((response: Response) => response.json());
    }

    getLocalRankings(offset: number, country: string) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.statUrl + `/local_rankings/${country}/${offset}`, options).map((response: Response) => response.json());
    }

    getGlobalRankings(offset: number) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.statUrl + `/global_rankings/${offset}`, options).map((response: Response) => response.json());
    }

    getPageNumbers(country: String) {
        let options = new RequestOptions({ withCredentials: true });
        return this.http.get(this.statUrl + `/page_numbers/${country}`, options).map((response: Response) => response.json());
    }
}