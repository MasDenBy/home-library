import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { BookService } from '../services/book.service';
import { ImageService } from '../../../common';
import { IBook } from '../models/book.model';
import { BookEditComponent } from './book-edit.component';

describe('BookEditComponent', () => {
    const id = 15;
    const book: IBook = {
        authors: '',
        description: '',
        file: null,
        id,
        title: '',
        metadata: null
    };

    let fixture: ComponentFixture<BookEditComponent>;
    let component: BookEditComponent;
    let bookService: jasmine.SpyObj<BookService>;
    let route: jasmine.SpyObj<ActivatedRoute>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BookEditComponent],
            providers: [
                { provide: BookService, useValue: jasmine.createSpyObj('BookService', ['getBook', 'update']) },
                { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl']) },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => id
                            }
                        }
                    },
                },
                ImageService
            ]
        });

        fixture = TestBed.createComponent(BookEditComponent);
        component = fixture.componentInstance;
        bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
        route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    describe('ngOnInit', () => {
        it('should load book', () => {
            bookService.getBook.and.returnValue(new Observable(observer => {
                observer.next(book);
            }));

            component.ngOnInit();

            expect(component.book).toEqual(book);
            expect(bookService.getBook).toHaveBeenCalledWith(id);
        });
    });

    describe('save', () => {
        it('should update book and redirect', () => {
            bookService.update.and.returnValue(new Observable(observer => {
                observer.next();
                observer.complete();
            }));

            component.book = book;
            component.save();

            expect(bookService.update).toHaveBeenCalledWith(book);
            expect(router.navigateByUrl).toHaveBeenCalledWith(`/books/${book.id}`);
        });
    });
});
