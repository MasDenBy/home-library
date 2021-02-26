import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SessionStorage } from './common';
import { Constants } from './constants';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let sessionStorage: jasmine.SpyObj<SessionStorage>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [AppComponent],
            providers: [
                { provide: SessionStorage, useValue: jasmine.createSpyObj('SessionStorage', ['setItem'])},
            ]
        });

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        sessionStorage = TestBed.inject(SessionStorage) as jasmine.SpyObj<SessionStorage>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    describe('search', () => {
        it('should redirect to search screen when pattern is specified', () => {
            const pattern = 'test pattern';

            spyOn(router, 'navigateByUrl');

            component.search(pattern);

            expect(sessionStorage.setItem).toHaveBeenCalledWith(Constants.offsetKey, '0');
            expect(router.navigateByUrl).toHaveBeenCalledWith(`/books/search/${pattern}`);
        });

        it('should not redirect to search screen when pattern is not specified', () => {
            spyOn(router, 'navigateByUrl');

            component.search(null);

            expect(sessionStorage.setItem).not.toHaveBeenCalled();
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });
    });
});
