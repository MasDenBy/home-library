import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UiService } from '../../../common';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
    const pattern = 'cool book';

    let fixture: ComponentFixture<SearchComponent>;
    let component: SearchComponent;
    let uiService: jasmine.SpyObj<UiService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchComponent],
            providers: [
                { provide: UiService, useValue: jasmine.createSpyObj('UiService', ['search']) },
            ]
        });

        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        uiService = TestBed.inject(UiService) as jasmine.SpyObj<UiService>;
    });

    it('search should call UI service', () => {
        component.search(pattern);

        expect(uiService.search).toHaveBeenCalledWith(pattern);
    });
});
