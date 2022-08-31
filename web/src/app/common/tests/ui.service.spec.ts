import { UiService } from '../ui.service';

describe('UiService', () => {
    let service: UiService;

    beforeEach(() => {
        service = new UiService();
    });

    it('search should put pattern to observable', (done) => {
        const pattern = 'text to search';

        service.search(pattern);

        service.searchPattern$.subscribe(actual => {
            expect(actual).toBe(pattern);
            done();
        });
    });
});
