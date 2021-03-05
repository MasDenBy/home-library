import 'reflect-metadata';

import { Config } from '../src/config';

describe('Config', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('port is null then set zero', () => {
        // Arrange
        process.env.PORT = null;

        // Act & Assert
        expect(new Config().port).toBe(0);
    });

    test('all', () => {
        // Arrange
        process.env.PORT = '1000';
        process.env.DB_HOST = 'host';
        process.env.DB_PORT = '2000';
        process.env.DB_USER_NAME = 'test_user';
        process.env.DB_USER_PASSWORD = 'test_password';
        process.env.DB_NAME = 'test_db';

        // Act
        const config = new Config();

        // Assert
        expect(config.port).toBe(1000);
        expect(config.database.host).toBe('host');
        expect(config.database.port).toBe(2000);
        expect(config.database.userName).toBe('test_user');
        expect(config.database.password).toBe('test_password');
        expect(config.database.name).toBe('test_db');
    });
});