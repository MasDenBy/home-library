import "reflect-metadata";

import { Request } from 'express';
import { mock, instance, when, verify } from 'ts-mockito';
import { results } from "inversify-express-utils";

import { LibraryService } from '../../../src/libraries/services/library.service';
import { LibrariesController } from '../../../src/libraries/controllers/libraries.controller';
import { Library } from '../../../src/common/dataaccess/entities/library.entity';
import { LibraryDto } from '../../../src/libraries/dto/library.dto';

describe('/libraries', () => {

    let controller: LibrariesController;
    let libraryServiceMock: LibraryService;

    beforeEach(() => {
        libraryServiceMock = mock(LibraryService);

        controller = new LibrariesController(instance(libraryServiceMock));
    });

    test('list', async () => {
        // Arrange
        const responseBody = [new Library()];

        when(libraryServiceMock.list()).thenResolve(responseBody);

        // Act
        const result = await controller.list();

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.json).toEqual(responseBody);
    });

    test('getById', async () => {
        // Arrange
        const testId: number = 1;
        const dto = <LibraryDto>{ id: testId, path: 'lib' };

        when(libraryServiceMock.getById(testId)).thenResolve(dto);

        // Act
        var result = await controller.getById(testId);

        // Assert
        expect(result.statusCode).toBe(200);
        expect(result.json).toEqual(dto);
    });

    test('create', async () => {
        // Arrange
        const testId: number = 1;
        const dto = <LibraryDto>{ path: 'lib' };
        const responseDto = {id: testId};

        const requestMock: Request = mock<Request>();
        when(requestMock.body).thenReturn(dto);

        when(libraryServiceMock.save(dto)).thenResolve(testId);

        // Act
        var result = await controller.create(instance(requestMock)) as any;

        // Assert
        expect(result.location).toBe('/libraries');
        expect(result.content).toEqual(responseDto);
    });

    test('delete', async () => {
        // Arrange
        const testId: number = 1;

        when(libraryServiceMock.deleteById(testId));

        // Act
        const result = await controller.delete(testId);

        // Assert
        expect(result.statusCode).toBe(204);

        verify(libraryServiceMock.deleteById(testId)).once();
    });

    test('index', async () => {
        // Arrange
        const ids = [5];

        const requestMock: Request = mock<Request>();
        when(requestMock.body).thenReturn(ids);

        // Act
        var result = await controller.index(instance(requestMock));

        // Assert
        expect(result).toBeInstanceOf(results.OkResult);
        
        verify(libraryServiceMock.index(ids)).once();
    });
});