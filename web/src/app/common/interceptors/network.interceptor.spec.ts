import { HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { LoadingService } from '../components/loading/loading.service';
import { NetworkInterceptor } from './network.interceptor';

describe('NetworkInterceptor', () => {
    let interceptor: NetworkInterceptor;
    let loadingSerice: jasmine.SpyObj<LoadingService>;
    let httpHandler: jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NetworkInterceptor,
                { provide: LoadingService, useValue: jasmine.createSpyObj('LoadingService', ['loadingOn', 'loadingOff']) },
                { provide: HttpHandler, useValue: jasmine.createSpyObj('HttpHandler', ['handle']) }
            ]
        });

        interceptor = TestBed.inject(NetworkInterceptor);
        loadingSerice = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
        httpHandler = TestBed.inject(HttpHandler) as jasmine.SpyObj<HttpHandler>;
    });

    it('intercept should show and hide loading spinner', () => {
        // Arrange
        const request = new HttpRequest<unknown>('GET', 'http://localhost/fake');

        httpHandler.handle.and.returnValue(new Observable(observer => {
            observer.next();
            observer.complete();
        }));

        // Act
        interceptor.intercept(request, httpHandler).subscribe();

        // Assert
        expect(loadingSerice.loadingOn).toHaveBeenCalledTimes(1);
        expect(loadingSerice.loadingOff).toHaveBeenCalledTimes(1);
    });

});
