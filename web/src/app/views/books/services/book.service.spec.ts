import { TestBed } from '@angular/core/testing';

import { BookService } from "./book.service";
import { HttpService } from '../../../common';
import { IBook, IPage } from '../models/book.model';
import { Observable } from 'rxjs';

describe('BookService', () => {
    const id: number = 12;
    const book: IBook = { 
        authors:'',
        description:'',
        file:null,
        goodreads_id:0,
        id:1,
        title:''
    };
    const offset: number = 10;
    const count: number = 20;
    const page: IPage = { count:10, data: [book] };

    let service: BookService;
    let httpService: jasmine.SpyObj<HttpService>;

    beforeEach(() => {
        var spy = jasmine.createSpyObj('HttpService', ['get', 'put', 'delete', 'getBlob', 'post']);

        TestBed.configureTestingModule({
            providers: [
                BookService,
                { provide: HttpService, useValue: spy }
            ]
        });

        service = TestBed.inject(BookService);
        httpService = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    })

    it('should get books', () => {
        httpService.get.and.returnValue(Observable.create(observer => {
            observer.next(page);
        }));

        service.getBooks(offset, count).subscribe(result => {
            expect(result).toEqual(page);

            expect(httpService.get).toHaveBeenCalledWith(`/books?offset=${offset}&count=${count}`);
        });
    });

    it('should get book', () => {
        httpService.get.and.returnValue(Observable.create(observer => {
            observer.next(book);
        }));

        service.getBook(id).subscribe(result => {
            expect(result).toEqual(book);

            expect(httpService.get).toHaveBeenCalledWith(`/books/${id}`);
        });
    });

    it('should update book', () => {
        httpService.put.and.returnValue(Observable.create(observer => {
            observer.next();
        }));

        service.update(book).subscribe(() => {
            expect(httpService.put).toHaveBeenCalledWith(`/books/${book.id}`, book);
        });
    });

    it('should delete book', () => {
        httpService.delete.and.returnValue(Observable.create(observer => {
            observer.next();
        }));

        service.delete(id).subscribe(result => {
            expect(httpService.delete).toHaveBeenCalledWith(`/books/${id}`);
        });
    });

    it('should search books', () => {
        const pattern: string = 'cool';

        httpService.post.and.returnValue(Observable.create(observer => {
            observer.next(page);
        }));

        service.search(pattern, offset, count).subscribe(result => {
            expect(result).toEqual(page);

            expect(httpService.post).toHaveBeenCalledWith('/books/search', jasmine.anything());
        });
    });

    it('should download book', () => {
        httpService.getBlob.and.returnValue(Observable.create(observer => {
            observer.next();
        }));

        service.download(id).subscribe(result => {
            expect(httpService.getBlob).toHaveBeenCalledWith(`/books/${id}/file`);
        });
    });
});