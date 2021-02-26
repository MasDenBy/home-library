import { Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable()
export class IndexService {
    constructor(private http: HttpService){}

    public indexLibrary(libraryId: number): Observable<unknown> {
        return this.http.get(`/libraries/${libraryId}/index`);
    }

    public indexBook(bookId: number): Observable<unknown> {
        return this.http.get(`/books/${bookId}/index`);
    }
}
