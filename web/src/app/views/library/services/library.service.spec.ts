import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { HttpService } from '../../../common/http.service';
import { ILibrary } from '../models/library.model';
import { LibraryService } from './library.service';


describe('LibraryService', () => {
    let service: LibraryService;
    let httpService: jasmine.SpyObj<HttpService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('HttpService', ['get', 'delete', 'post']);

        TestBed.configureTestingModule({
            providers: [
                LibraryService,
                { provide: HttpService, useValue: spy }
            ]
        });

        service = TestBed.inject(LibraryService);
        httpService = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    });

    it('should get libraries', () => {
        const library: ILibrary = { path: 'path', id: 1 };

        httpService.get.and.returnValue(new Observable(observer => {
            observer.next([library]);
        }));

        service.getLibraries().subscribe(result => {
            expect(result).toEqual([library]);

            expect(httpService.get).toHaveBeenCalledWith('/libraries');
        });
    });

    it('should delete library', () => {
        const libId = 1;

        httpService.delete.and.returnValue(new Observable(observer => {
            observer.next(new Object());
        }));

        service.delete(libId).subscribe(result => {
            expect(result).toBeTruthy();

            expect(httpService.delete).toHaveBeenCalledWith(`/libraries/${libId}`);
        });
    });

    it('should create library', () => {
        const path = 'path';
        const id = 1;

        httpService.post.and.returnValue(new Observable(observer => {
            observer.next(id);
        }));

        service.create(path).subscribe(result => {
            expect(result).toBe(id);

            expect(httpService.post).toHaveBeenCalledWith('/libraries/', { path, id: 0 });
        });
    });
});
