import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPage } from '../models/book.model';
import { BookService } from '../services/book.service';
import { ImageService, SessionStorage } from '../../../common';
import { Constants } from '../../../constants';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../../../common/components/loading/loading.service';

@Component({
    templateUrl: './books-list.component.html',
    selector: 'app-books-list',
    styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
    public page: IPage;
    public count = 18;
    public offset = 0;
    private pattern: string;

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private sessionStorage: SessionStorage,
        private readonly loadingService: LoadingService,
        public imageService: ImageService) { }

    ngOnInit(): void {
        this.pattern = this.route.snapshot.paramMap.get('pattern');

        const offset = this.sessionStorage.getItem(Constants.offsetKey);

        this.offset = offset ? +offset : 0;
    }

    loadBooks(event) {
        this.sessionStorage.setItem(Constants.offsetKey, event.first);

        this.retrieveBooks(event.first, event.rows);
    }

    private retrieveBooks(offset: number, count: number): void {
        const page$ = (this.pattern
            ? this.bookService.search(this.pattern, offset, count)
            : this.bookService.getBooks(offset, count))
            .pipe(
                tap(page => this.page = page)
            );

        this.loadingService.showLoaderUntilCompleted(page$)
                .subscribe();
    }
}
