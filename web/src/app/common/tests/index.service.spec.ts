import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { HttpService } from '../http.service';
import { IndexService } from '../index.service';


describe('IndexService', () => {
    const testId = 1;

    let service: IndexService;
    let httpService: jasmine.SpyObj<HttpService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IndexService,
                { provide: HttpService, useValue: jasmine.createSpyObj('HttpService', ['get']) }
            ]
        });

        service = TestBed.inject(IndexService);
        httpService = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    });

    it('should index library', () => {
        httpService.get.and.returnValue(new Observable(observer => {
            observer.next(new Object());
        }));

        service.indexLibrary(testId).subscribe(result => {
            expect(result).toBeTruthy();

            expect(httpService.get).toHaveBeenCalledWith(`/libraries/${testId}/index`);
        });
    });

    it('should index book', () => {
        httpService.get.and.returnValue(new Observable(observer => {
            observer.next(new Object());
        }));

        service.indexBook(testId).subscribe(result => {
            expect(result).toBeTruthy();

            expect(httpService.get).toHaveBeenCalledWith(`/books/${testId}/index`);
        });
    });
});
