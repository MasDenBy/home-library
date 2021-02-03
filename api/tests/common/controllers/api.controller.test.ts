import "reflect-metadata";

import { ApiController } from '../../../src/common';

describe('ApiController', () => {
    test('noContent', () => {
        // Arrange
        const controller = new TestController();

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