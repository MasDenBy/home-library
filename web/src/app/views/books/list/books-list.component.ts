import { Component } from '@angular/core';

import { IPage } from '../models/book.model';
import { BookService } from '../services/book.service';
import { ImageService } from '../../../common';
import { switchMap } from 'rxjs/operators';
import { UiService } from '../../../common/ui.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

@Component({
    templateUrl: './books-list.component.html',
    selector: 'app-books-list',
    styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent {
    public page$: Observable<IPage>;
    public count = 18;
    public offset = 0;
    private loadEvent$: Observable<{offset: number; count: number}>;
    private loadEventSubject: BehaviorSubject<{offset: number; count: number}>;

    constructor(
        private bookService: BookService,
        private readonly uiService: UiService,
        public imageService: ImageService) {
            this.loadEventSubject = new BehaviorSubject({ offset: 0, count: this.count });
            this.loadEvent$ = this.loadEventSubject.asObservable();

           this.page$ = combineLatest([
                this.loadEvent$,
                this.uiService.searchPattern$
            ]).pipe(
                switchMap(([event, pattern]) => pattern
                    ? this.bookService.search(pattern, event.offset, event.count)
                    : this.bookService.getBooks(event.offset, event.count))
            );
    }

    loadBooks(event) {
        this.loadEventSubject.next({offset: event.first, count: event.rows});
    }
}
