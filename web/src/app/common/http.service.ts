import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class HttpService {
    constructor(private http: HttpClient){}

    public get<T>(url: string): Observable<T> {
        return this.http.get<T>(this.getUrl(url));
    }

    public getBlob(url: string): Observable<HttpResponse<Blob>> {
        return this.http.get(this.getUrl(url), { responseType: 'blob', observe: 'response' });
    }

    public delete(url: string): Observable<object> {
        return this.http.delete(this.getUrl(url));
    }

    public post<T>(url: string, body: any): Observable<T> {
        return this.http.post<T>(this.getUrl(url), body);
    }

    public put<T>(url: string, body: any): Observable<T> {
        return this.http.put<T>(this.getUrl(url), body);
    }

    private getUrl(url: string): string {
        return environment.api + url;
    }
}
