import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BookService } from '../services/book.service';
import { ImageService } from '../../../common';
import { IBook, IMetadata } from '../models/book.model';

@Component({
    templateUrl: './book-edit.component.html',
    selector: 'app-book-edit',
    styleUrls: ['./book-edit.component.scss']
})
export class BookEditComponent implements OnInit {
    book: IBook;

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private router: Router,
        public imageService: ImageService) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.paramMap.get('id');

        this.bookService.getBook(id).subscribe((book: IBook) => {
            if(book.metadata == null) {
                book.metadata = {} as IMetadata;
            }

            this.book = book;
        });
    }

    save(): void {
        this.bookService.update(this.book).subscribe(() => {
            this.router.navigateByUrl(`/books/${this.book.id}`);
        });
    }
}
