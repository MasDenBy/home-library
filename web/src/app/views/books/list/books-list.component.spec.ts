import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { DataViewModule } from 'primeng/dataview';

import { BooksListComponent } from './books-list.component';
import { BookService } from '../services/book.service';
import { IPage } from '../models/book.model';
import { ImageService, UiService } from '../../../common';
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
                UiService,
                ImageService
            ]
        });

        bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
        uiService = TestBed.inject(UiService) as jasmine.SpyObj<UiService>;
    });

    describe('page$', () => {
        it('should get list of books if search patter is empty', () => {
            // Arrange
            bookService.getBooks.and.returnValue(new Observable(observer => {
                observer.next(page);
            }));

            // Act
            fixture = TestBed.createComponent(BooksListComponent);
            component = fixture.componentInstance;
            component.page$.subscribe();

            // Assert
            expect(bookService.getBooks).toHaveBeenCalled();
        });

        it('should search books if search patter is presented', () => {
            // Arrange
            uiService.search(pattern);
            bookService.search.and.returnValue(new Observable(observer => {
                observer.next(page);
            }));

            // Act
            fixture = TestBed.createComponent(BooksListComponent);
            component = fixture.componentInstance;
            component.page$.subscribe();

            // Assert
            expect(bookService.search).toHaveBeenCalled();
        });
    });

    it('loadBooks should push offset and count', () => {
        // Arrange
        bookService.getBooks.and.returnValue(new Observable(observer => {
            observer.next(page);
        }));

        const event = { first: 15, rows: 30 };

        // Act
        fixture = TestBed.createComponent(BooksListComponent);
        component = fixture.componentInstance;
        component.loadBooks(event);
        component.page$.subscribe();

        // Assert
        expect(bookService.getBooks).toHaveBeenCalledWith(event.first, event.rows);
    });
});
