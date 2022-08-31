import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';

import { DataViewModule } from 'primeng/dataview';

import { BooksListComponent } from './books-list.component';
import { BookService } from '../services/book.service';
import { IPage } from '../models/book.model';
import { ImageService, SessionStorage, UiService } from '../../../common';
import { Constants } from '../../../constants';
import { LoadingService } from '../../../common/components/loading/loading.service';
import { LoadingComponent } from '../../../common/components/loading/loading.component';

describe('BooksListComponent', () => {
    const pattern = 'cool book';
    const page: IPage = {
        count: 2,
        data: [
            { authors: '', description: '', file: null, id: 1, title: '', metadata: null }
        ]
    };

    let fixture: ComponentFixture<BooksListComponent>;
    let component: BooksListComponent;
    let bookService: jasmine.SpyObj<BookService>;
    let uiService: jasmine.SpyObj<UiService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                DataViewModule
            ],
            declarations: [BooksListComponent, LoadingComponent],
            providers: [
                { provide: BookService, useValue: jasmine.createSpyObj('BookService', ['getBooks', 'search']) },
                { provide: UiService, useValue: jasmine.createSpyObj('UiService', ['search'])},
                ImageService
            ]
        });

        fixture = TestBed.createComponent(BooksListComponent);
        component = fixture.componentInstance;
        bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
        uiService = TestBed.inject(UiService) as jasmine.SpyObj<UiService>;
    });

    // describe('ngOnInit', () => {
    //     beforeEach(() => {
    //         paramMap.get.and.returnValue(pattern);
    //     });

    //     it('should get pattern', () => {
    //         component.ngOnInit();

    //         expect(paramMap.get).toHaveBeenCalledWith('pattern');
    //     });

    //     it('should set offset when it exists in session', () => {
    //         const testOffset = 10;

    //         sessionStorage.getItem.and.returnValue(testOffset.toString());

    //         component.ngOnInit();

    //         expect(component.offset).toEqual(testOffset);
    //         expect(sessionStorage.getItem).toHaveBeenCalledWith(Constants.offsetKey);
    //     });

    //     it('should set offset to 0 when it doesnot exists in session', () => {
    //         sessionStorage.getItem.and.returnValue(null);

    //         component.ngOnInit();

    //         expect(component.offset).toEqual(0);
    //         expect(sessionStorage.getItem).toHaveBeenCalledWith(Constants.offsetKey);
    //     });
    // });

    // describe('loadBooks', () => {
    //     it('should load books with offset and count specified', () => {
    //         bookService.getBooks.and.returnValue(new Observable(observer => {
    //             observer.next(page);
    //         }));

    //         const event = { first: 10, rows: 20};
    //         component.loadBooks(event);

    //         expect(component.page$).toEqual(page);
    //         expect(bookService.getBooks).toHaveBeenCalledWith(event.first, event.rows);
    //         expect(sessionStorage.setItem).toHaveBeenCalledWith(Constants.offsetKey, event.first as any);
    //     });

    //     it('should search books with offset and count if pattern is specified', () => {
    //         paramMap.get.and.returnValue(pattern);

    //         bookService.getBooks.and.returnValue(new Observable(observer => {
    //             observer.next(page);
    //         }));

    //         bookService.search.and.returnValue(new Observable(observer => {
    //             observer.next(page);
    //         }));

    //         //component.ngOnInit();

    //         const event = { first: 10, rows: 20};
    //         component.loadBooks(event);

    //         expect(bookService.search).toHaveBeenCalledWith(pattern, event.first, event.rows);
    //     });
    // });
});
