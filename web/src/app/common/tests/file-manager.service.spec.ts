import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { HttpService } from '../http.service';
import { FileManagerService } from '../file-manager.service';
import { IPath } from '../../models';

describe('FileManagerService', () => {
    const expectedPath: IPath = { path: 'path', folders: ['a', 'b'] };

    let service: FileManagerService;
    let httpSpy: jasmine.SpyObj<HttpService>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FileManagerService,
                { provide: HttpService, useValue: jasmine.createSpyObj('HttpService', ['get']) }
            ]
        });

        service = TestBed.inject(FileManagerService);
        httpSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;

        httpSpy.get.and.returnValue(new Observable(observer => {
            observer.next(expectedPath);
            observer.complete();
        }));
    });

    it('should get /fm when path is empty', () => {
        service.getPaths().subscribe((result: IPath) => {
            expect(result.path).toBe(expectedPath.path);
            expect(result.folders).toBe(expectedPath.folders);

            expect(httpSpy.get.calls.count()).toBe(1);
            expect(httpSpy.get).toHaveBeenCalledWith('/fm');
        });
    });

    it('should get /fm?path=test when path is test', () => {
        service.getPaths('test').subscribe((result: IPath) => {
            expect(result.path).toBe(expectedPath.path);
            expect(result.folders).toBe(expectedPath.folders);

            expect(httpSpy.get.calls.count()).toBe(1);
            expect(httpSpy.get).toHaveBeenCalledWith('/fm?path=test');
        });
    });
});
