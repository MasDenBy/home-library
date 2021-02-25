import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import {ListboxModule} from 'primeng/listbox';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';

import {ConfirmationService, MessageService} from 'primeng/api';

import { Observable } from 'rxjs';

import { LibraryService } from '../services/library.service';
import { ILibrary } from '../models/library.model';
import { LibraryListComponent } from './library-list.component';

describe('LibraryListComponent', () => {
    const libraries: ILibrary[] = [{ id: 1, path: 'p' }, { id: 2, path: 't' }];

    let component: LibraryListComponent;
    let fixture: ComponentFixture<LibraryListComponent>;
    let libraryService: jasmine.SpyObj<LibraryService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LibraryListComponent],
            imports: [
                ListboxModule,
                ConfirmDialogModule,
                ToastModule,
                BrowserAnimationsModule
            ],
            providers: [
                ConfirmationService,
                MessageService,
                { provide: LibraryService, useValue: jasmine.createSpyObj('LibraryService', ['getLibraries', 'delete']) },
            ]
        });

        fixture = TestBed.createComponent(LibraryListComponent);
        component = fixture.componentInstance;
        libraryService = fixture.debugElement.injector.get(LibraryService) as jasmine.SpyObj<LibraryService>;

        libraryService.getLibraries.and.returnValue(new Observable(observer => {
            observer.next(libraries);
        }));

        component.ngOnInit();
    }));

    it('ngOnInit should set libraries', () => {
        expect(component.Libraries).toEqual(libraries);
    });

    describe('delete: ', () => {
        const id = 1;

        it('should not delete if not accept', () => {
            component.delete(id);

            fixture.detectChanges();

            const reject = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[1].nativeElement;
            reject.click();

            expect(libraryService.delete).not.toHaveBeenCalledWith(id);
        });

        it('should delete if accept and show SUCCESS message', () => {
            libraryService.delete.and.returnValue(new Observable(observer => {
                observer.complete();
            }));

            component.delete(id);

            fixture.detectChanges();

            const confirm = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[0].nativeElement;
            confirm.click();

            fixture.detectChanges();

            const toastMessage = fixture.debugElement.query(By.css('.ui-toast-message'));
            expect(toastMessage.nativeElement).toBeTruthy();
            expect(toastMessage.nativeElement.classList).toContain('ui-toast-message-success');

            expect(libraryService.delete).toHaveBeenCalledWith(id);
        });

        it('should delete if accept and show ERROR message when error', () => {
            libraryService.delete.and.returnValue(new Observable(observer => {
                observer.error();
            }));

            component.delete(id);

            fixture.detectChanges();

            const confirm = fixture.debugElement.query(By.css('.ui-dialog-footer')).children[0].nativeElement;
            confirm.click();

            fixture.detectChanges();

            const toastMessage = fixture.debugElement.query(By.css('.ui-toast-message'));
            expect(toastMessage.nativeElement).toBeTruthy();
            expect(toastMessage.nativeElement.classList).toContain('ui-toast-message-error');

            expect(libraryService.delete).toHaveBeenCalledWith(id);
        });
    });
});
