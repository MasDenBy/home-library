import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpService } from '../../../common';

import { IPage, IBook, BookSearchDto } from '../models/book.model';

@Injectable()
export class BookService {
    constructor(private http: HttpService){}

    public getBooks(offset: number, count: number): Observable<IPage> {
        return this.http.get<IPage>(`/books?offset=${offset}&count=${count}`);
    }

    public getBook(id: number): Observable<IBook> {
        return this.http.get<IBook>(`/books/${id}`);
    }

    public update(book: IBook): Observable<IBook> {
        return this.http.put<IBook>(`/books/${book.id}`, book);
    }

    public delete(id: number): Observable<object> {
        return this.http.delete(`/books/${id}`);
    }

    public search(pattern: string, offset: number, count: number): Observable<IPage> {
        const dto = { count, offset, pattern } as BookSearchDto;
        return this.http.post('/books/search', dto);
    }

    public download(id: number): Observable<HttpResponse<Blob>> {
        return this.http.getBlob(`/books/${id}/file`);
    }
}
