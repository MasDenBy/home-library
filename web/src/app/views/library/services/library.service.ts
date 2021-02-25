import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../common/http.service';
import { ILibrary } from '../models/library.model';

@Injectable()
export class LibraryService {
    constructor(private http: HttpService){}

    public getLibraries(): Observable<ILibrary[]> {
        return this.http.get<ILibrary[]>('/libraries');
    }

    public delete(id: number): Observable<object> {
        return this.http.delete(`/libraries/${id}`);
    }

    public create(path: string): Observable<number> {
        const body: ILibrary = { path, id: 0 };
        return this.http.post<number>('/libraries/', body);
    }
}
