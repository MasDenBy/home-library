import "reflect-metadata";

import { ApiController } from '../../../src/common/controllers/api.controller';

describe('ApiController', () => {
    let controller: TestController;

    beforeEach(() => {
        controller = new TestController();
    });

    test('noContent', () => {
        // Act
        var response = controller.noContentCaller();

        // Assert
        expect(response.statusCode).toBe(204);
    });
});

class TestController extends ApiController {
    public noContentCaller() {
        return this.noContent();
    }
}