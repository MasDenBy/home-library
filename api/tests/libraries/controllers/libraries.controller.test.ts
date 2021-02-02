import { Request, Response } from 'express';
import { mock, instance, when, verify, deepEqual } from 'ts-mockito';

import { LibraryService } from '../../../src/libraries/services/library.service';
import { LibrariesController } from '../../../src/libraries/controllers/libraries.controller';
import { Library } from '../../../src/libraries/dataaccess/library.entity';
import { LibraryDto } from '../../../src/libraries/dto/library.dto';

describe('/libraries', () => {

    let controller: LibrariesController;
    let libraryServiceMock: LibraryService;
    let responseMock: Response;
    let requestMock: Request;

    beforeEach(() => {
        libraryServiceMock = mock(LibraryService);
        responseMock = mock<Response>();
        requestMock = mock<Request>();

        controller = new LibrariesController(instance(libraryServiceMock));
    });

    test('list', async () => {
        // Arrange
        const responseBody = [new Library()];
        when(libraryServiceMock.list()).thenResolve(responseBody);
        
        when(responseMock.status(200)).thenReturn(instance(responseMock));
        when(responseMock.send()).thenReturn();

        // Act
        await controller.list(instance(requestMock), instance(responseMock));

        // Assert
        verify(responseMock.status(200)).once();
        verify(responseMock.send(deepEqual(responseBody))).once();
    });

    test('getById', async () => {
        // Arrange
        const testId: number = 1;
        const dto = <LibraryDto>{ id: testId, path: 'lib' };

        when(libraryServiceMock.getById(testId)).thenResolve(dto);

        when(responseMock.status(200)).thenReturn(instance(responseMock));
        when(responseMock.send(dto)).thenReturn();

        // Act
        await controller.getById(testId, instance(responseMock));

        // Assert
        verify(responseMock.status(200)).once();
        verify(responseMock.send(deepEqual(dto))).once();
    });

    test('create', async () => {
        // Arrange
        const testId: number = 1;
        const dto = <LibraryDto>{ path: 'lib' };
        const responseDto = {id: testId};

        when(requestMock.body).thenReturn(dto);

        when(libraryServiceMock.save(dto)).thenResolve(testId);

        when(responseMock.status(201)).thenReturn(instance(responseMock));
        when(responseMock.send(responseDto)).thenReturn();

        // Act
        await controller.create(instance(requestMock), instance(responseMock));

        // Assert
        verify(responseMock.status(201)).once();
        verify(responseMock.send(deepEqual(responseDto))).once();
    });

    test('delete', async () => {
        // Arrange
        const testId: number = 1;

        when(libraryServiceMock.deleteById(testId));

        when(responseMock.status(204)).thenReturn(instance(responseMock));
        when(responseMock.send()).thenReturn();

        // Act
        await controller.delete(testId, instance(responseMock));

        // Assert
        verify(responseMock.status(204)).once();
        verify(responseMock.send()).once();
    });
});