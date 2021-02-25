import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { IPath } from '../models';

@Injectable()
export class FileManagerService {
    constructor(private http: HttpService){}

    public getPaths(path: string = ''): Observable<IPath> {
        const uri = path !== '' ? `/fm?path=${path}` : `/fm`;
        return this.http.get<IPath>(uri);
    }
}
