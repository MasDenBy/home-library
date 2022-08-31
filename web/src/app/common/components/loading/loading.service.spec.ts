import { LoadingService } from './loading.service';

describe('LoadingService', () => {
    let service: LoadingService;

    beforeEach(() => {
        service = new LoadingService();
    });

    it('after init loading is off', (done) => {
        service.loading$.subscribe(actual => {
            expect(actual).toBeFalse();
            done();
        });
    });

    it('loadingOn set loading to true', (done) => {
        service.loadingOn();

        service.loading$.subscribe(actual => {
            expect(actual).toBeTrue();
            done();
        });
    });

    it('loadingOff set loading to false', (done) => {
        service.loadingOff();

        service.loading$.subscribe(actual => {
            expect(actual).toBeFalse();
            done();
        });
    });
});
