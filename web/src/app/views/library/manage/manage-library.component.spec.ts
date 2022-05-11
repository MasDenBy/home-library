import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, ComponentFixture, fakeAsync, waitForAsync } from '@angular/core/testing';


import {ListboxModule} from 'primeng/listbox';
import {ToastModule} from 'primeng/toast';

import { MessageService} from 'primeng/api';

import { Observable } from 'rxjs';

import { FileManagerService, IndexService } from '../../../common';
import { IPath } from '../../../models';
import { ManageLibraryComponent } from './manage-library.component';
import { LibraryService } from '../services/library.service';

describe('ManageLibraryComponent', () => {
    const testPath: IPath = { path: '/', folders: ['a', 'b']};

    let component: ManageLibraryComponent;
    let fixture: ComponentFixture<ManageLibraryComponent>;
    let libraryService: jasmine.SpyObj<LibraryService>;
    let fileManagerService: jasmine.SpyObj<FileManagerService>;
    let indexService: jasmine.SpyObj<IndexService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ManageLibraryComponent],
            imports: [
                FormsModule,
                BrowserAnimationsModule,
                ListboxModule,
                ToastModule
            ],
            providers: [
                MessageService,
                { provide: LibraryService, useValue: jasmine.createSpyObj('LibraryService', ['create']) },
                { provide: FileManagerService, useValue: jasmine.createSpyObj('FileManagerService', ['getPaths']) },
                { provide: IndexService, useValue: jasmine.createSpyObj('IndexService', ['indexLibrary']) },
                { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigateByUrl']) },
            ]
        });

        fixture = TestBed.createComponent(ManageLibraryComponent);
        component = fixture.componentInstance;
        libraryService = TestBed.inject(LibraryService) as jasmine.SpyObj<LibraryService>;
        fileManagerService = TestBed.inject(FileManagerService) as jasmine.SpyObj<FileManagerService>;
        indexService = TestBed.inject(IndexService) as jasmine.SpyObj<IndexService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fileManagerService.getPaths.and.returnValue(new Observable(observer => {
            observer.next(testPath);
        }));

        component.ngOnInit();
    }));

    it('ngOnInit should set Folders and CurrentPath', () => {
        expect(component.folders).toEqual(testPath.folders);
        expect(component.currentPath).toEqual(testPath.path);
    });

    describe('save', () => {
        const id = 1;

        it('should create and index library with SUCCESS toast', () => {
            // Arrange
            libraryService.create.and.returnValue(new Observable(observer => {
                observer.next(id);
                observer.complete();
            }));

            indexService.indexLibrary.and.returnValue(new Observable(observer => {
                observer.complete();
            }));

            // Act
            component.save();

            // Assert
            expect(libraryService.create).toHaveBeenCalledWith(testPath.path);
            expect(indexService.indexLibrary).toHaveBeenCalledWith(id);
            expect(router.navigateByUrl).toHaveBeenCalledWith('/libraries');
        });

        it('should create and index library with ERROR toast', fakeAsync(() => {
            // Arrange
            libraryService.create.and.returnValue(new Observable(observer => {
                observer.error();
            }));

            // Act
            component.save();
            fixture.detectChanges();

            // Assert
            expect(libraryService.create).toHaveBeenCalledWith(testPath.path);
            expect(indexService.indexLibrary).not.toHaveBeenCalled();
            expect(router.navigateByUrl).not.toHaveBeenCalledWith('/libraries');
        }));
    });

    describe('openFolder', () => {
        const folderPath = 'path';

        it('should add / to folder if current is root', () => {
            component.openFolder(folderPath);

            expect(fileManagerService.getPaths).toHaveBeenCalledWith(`/${folderPath}`);
        });

        it('should join the path and open folder', () => {
            const currentPath = '/myfolder';

            component.currentPath = currentPath;
            component.openFolder(folderPath);

            expect(fileManagerService.getPaths).toHaveBeenCalledWith(`${currentPath}/${folderPath}`);
        });

        it('should use path args if currentPath is null', () => {
            component.currentPath = null;
            component.openFolder(folderPath);

            expect(fileManagerService.getPaths).toHaveBeenCalledWith(folderPath);
        });
    });

    describe('back', () => {
        it('should not go back if current path is null', () => {
            component.currentPath = null;

            component.back();

            expect(fileManagerService.getPaths).not.toHaveBeenCalledTimes(2);
        });

        it('should not go back if current path is root', () => {
            component.currentPath = '/';

            component.back();

            expect(fileManagerService.getPaths).not.toHaveBeenCalledTimes(2);
        });

        it('should go back', () => {
            component.currentPath = '/folder';

            component.back();

            expect(fileManagerService.getPaths).toHaveBeenCalledWith('/');
        });
    });
});
