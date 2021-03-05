import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Observable } from 'rxjs';

import { BookDetailsComponent } from './book-details.component';
import { BookService } from '../services/book.service';
import { ImageService, IndexService, WindowWrapper } from '../../../common';
import { IBook, IMetadata } from '../models/book.model';
import { HttpResponse } from '@angular/common/http';

describe('BookDetailsComponent', () => {
    const id = 15;
    const book: IBook = {
        authors: '',
        description: '',
        file: { image: '', id: 1, libraryId: 1, path: '' },
        id,
        title: '',
        metadata: {} as IMetadata
    };

    let fixture: ComponentFixture<BookDetailsComponent>;
    let component: BookDetailsComponent;
    let bookService: jasmine.SpyObj<BookService>;
    let indexService: jasmine.SpyObj<IndexService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SplitButtonModule,
                RouterTestingModule,
                NoopAnimationsModule,
                ConfirmDialogModule,
                ToastModule
            ],
            declarations: [BookDetailsComponent],
            providers: [
                { provide: BookService, useValue: jasmine.createSpyObj('BookService', ['getBook', 'delete', 'download']) },
                { provide: IndexService, useValue: jasmine.createSpyObj('IndexService', ['indexBook'])},
                { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl'])},
                { provide: WindowWrapper, useValue: jasmine.createSpyObj('WindowWrapper', ['createObjectURL', 'revokeObjectURL'])},
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
                ImageService,
                ConfirmationService,
                MessageService
            ]
        });

        fixture = TestBed.createComponent(BookDetailsComponent);
        component = fixture.componentInstance;
        bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
        indexService = TestBed.inject(IndexService) as jasmine.SpyObj<IndexService>;
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

    describe('updateMetadata', () => {
        it('should update metadata and get new book information', () => {
            const updatedBook: IBook = {
                authors: 'Author, Name',
                description: '',
                file: { image: '', id: 1, libraryId: 1, path: '' },
                id,
                title: 'Updated book',
                metadata: null
            };

            bookService.getBook.and.returnValue(new Observable(observer => {
                observer.next(updatedBook);
            }));

            indexService.indexBook.and.returnValue(new Observable(observer => {
                observer.next();
            }));

            component.book = book;

            fixture.detectChanges();

            const dropDownEl = fixture.debugElement.query(By.css('.ui-splitbutton-menubutton')).nativeElement;
            dropDownEl.click();
            fixture.detectChanges();

            const menuEl = fixture.debugElement.query(By.css('.ui-menuitem')).children[0].nativeElement;
            menuEl.click();
            fixture.detectChanges();

            expect(component.book).toEqual(updatedBook);
            expect(bookService.getBook).toHaveBeenCalledWith(id);
            expect(indexService.indexBook).toHaveBeenCalledWith(id);
        });
    });

    describe('deleteBook', () => {
        beforeEach(() => {
            bookService.getBook.and.returnValue(new Observable(observer => {
                observer.next(book);
            }));

            component.ngOnInit();
            fixture.detectChanges();

            const dropDownEl = fixture.debugElement.query(By.css('.ui-splitbutton-menubutton')).nativeElement;
            dropDownEl.click();
            fixture.detectChanges();

            const deleteCommand = fixture.debugElement.query(By.css('.ui-menuitem:nth-child(2)')).children[0].nativeElement;
            deleteCommand.click();
            fixture.detectChanges();
        });

        it('should not delete if not accept', () => {
            const reject = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[1].nativeElement;
            reject.click();

            expect(bookService.delete).not.toHaveBeenCalledWith(id);
        });

        it('should delete if accept and redirect to root', () => {
            bookService.delete.and.returnValue(new Observable(observer => {
                observer.next();
                observer.complete();
            }));

            const confirm = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[0].nativeElement;
            confirm.click();

            fixture.detectChanges();

            expect(bookService.delete).toHaveBeenCalledWith(id);
            expect(router.navigateByUrl).toHaveBeenCalledWith(`/`);
        });

        it('should delete if accept and show ERROR message when error', () => {
            bookService.delete.and.returnValue(new Observable(observer => {
                observer.error();
            }));

            const confirm = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[0].nativeElement;
            confirm.click();

            fixture.detectChanges();

            const toastMessage = fixture.debugElement.query(By.css('.ui-toast-message'));
            expect(toastMessage.nativeElement).toBeTruthy();
            expect(toastMessage.nativeElement.classList).toContain('ui-toast-message-error');

            expect(bookService.delete).toHaveBeenCalledWith(id);
        });
    });

    describe('edit', () => {
        it('should navigate to edit page', () => {
            component.book = book;
            component.edit();

            expect(router.navigateByUrl).toHaveBeenCalledWith(`/books/${book.id}/edit`);
        });
    });

    describe('download', () => {
        it('should download book file', () => {
            const blobResponse = new HttpResponse<Blob>();
            blobResponse.headers.append('Content-Disposition', `attachment; filename="test.pdf"`);

            bookService.download.and.returnValue(new Observable(observer => {
                observer.next(blobResponse);
            }));

            component.book = book;
            component.download();

            expect(bookService.download).toHaveBeenCalledWith(book.id);
        });

        it('should show toast when error happened', () => {
            bookService.getBook.and.returnValue(new Observable(observer => {
                observer.next(book);
            }));

            bookService.download.and.returnValue(new Observable(observer => {
                observer.error();
            }));

            component.ngOnInit();
            fixture.detectChanges();

            component.download();
            fixture.detectChanges();

            expect(bookService.download).toHaveBeenCalledWith(book.id);

            const toastMessage = fixture.debugElement.query(By.css('.ui-toast-message'));
            expect(toastMessage.nativeElement).toBeTruthy();
            expect(toastMessage.nativeElement.classList).toContain('ui-toast-message-error');
        });
    });
});
