import { SessionStorage } from '../session.storage';

describe('SessionStorage', () => {
    const testKey = 'test_key';
    const testValue = 'test_value';

    let service: SessionStorage;

    beforeEach(() => {
        service = new SessionStorage();
    });

    it('should get item', () => {
        spyOn(window.sessionStorage, 'getItem').and.returnValue(testValue);

        expect(service.getItem(testKey)).toEqual(testValue);
        expect(window.sessionStorage.getItem).toHaveBeenCalledWith(testKey);
    });

    it('should set item', () => {
        spyOn(window.sessionStorage, 'setItem');

        service.setItem(testKey, testValue);

        expect(window.sessionStorage.setItem).toHaveBeenCalledWith(testKey, testValue);
    });
});
