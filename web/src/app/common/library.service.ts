import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { ILibrary } from '../models';

@Injectable()
export class LibraryService {
    constructor(private http: HttpService){}

    public getLibraries(): Observable<ILibrary[]> {
        return this.http.get<ILibrary[]>('/libraries');
    }

    public delete(id: number): Observable<Object> {
        return this.http.delete(`/libraries/${id}`);
    }
}