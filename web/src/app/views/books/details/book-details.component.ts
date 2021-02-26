import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';

import { BookService } from '../services/book.service';
import { ImageService, IndexService, HttpHelper, WindowWrapper } from '../../../common';
import { IBook } from '../models/book.model';
import { HttpResponse } from '@angular/common/http';

@Component({
    templateUrl: './book-details.component.html',
    selector: 'app-book-details',
    styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
    public book: IBook;
    public commands: MenuItem[];

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private indexService: IndexService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
        private windowWrapper: WindowWrapper,
        public imageService: ImageService) { }

    ngOnInit(): void {
        this.initializeCommands();
        this.getBook();
    }

    download(): void {
        this.bookService.download(this.book.id).subscribe((response: HttpResponse<Blob>) => {
            const wrapper = this.windowWrapper;
            const objectUrl = wrapper.createObjectURL(response.body);

            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = HttpHelper.getFileNameFromHttpResponse<Blob>(response);
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

            setTimeout(() => {
                wrapper.revokeObjectURL(objectUrl);
                link.remove();
            }, 100);
        },
        error => this.messageService.add({severity: 'error', summary: 'Error of downloading the book'}));
    }

    edit(): void {
        this.router.navigateByUrl(`/books/${this.book.id}/edit`);
    }

    private getBook(): void {
        const id = +this.route.snapshot.paramMap.get('id');

        this.bookService.getBook(id).subscribe((book: IBook) => {
            this.book = book;
        });
    }

    private initializeCommands(): void {
        this.commands = [
            { label: 'Update metadata', icon: 'pi pi-refresh', command: () => this.updateMetadata() },
            { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteBook() }
        ];
    }

    private updateMetadata(): void {
        this.indexService.indexBook(this.book.id).subscribe(() => {
            this.getBook();
        });
    }

    private deleteBook(): void {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this book file?',
            accept: () => {
                this.bookService.delete(this.book.id).subscribe(
                    x => null,
                    error => this.messageService.add({severity: 'error', summary: 'Book was not deleted'}),
                    () => this.router.navigateByUrl('/')
                );
            }
        });
    }
}
