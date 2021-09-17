import { DeleteResult } from 'typeorm';
import { mock, instance, when, verify, anyOfClass, anything } from 'ts-mockito';
import { LibraryService } from '../library.service';
import { LibraryDataStore } from '../../database/library.datastore';
import { LibraryDto } from '../../library.dto';
import { Library } from '../../database/library.entity';
import { IndexerService } from '../indexer.service';

describe('LibraryService', () => {

    let service: LibraryService;
    let dataStoreMock: LibraryDataStore;
    let indexerMock: IndexerService;

    beforeEach(() => {
        dataStoreMock = mock(LibraryDataStore);
        indexerMock = mock(IndexerService);

        service = new LibraryService(instance(dataStoreMock), instance(indexerMock));
    });

    test('list', async () => {
        // Arrange
        when(dataStoreMock.list()).thenResolve([]);

        // Act
        await service.list();

        // Assert
        verify(dataStoreMock.list()).once();
    });

    test('save', async () => {
        // Arrange
        const id = 1;
        const path = 'test';
        const dto = <LibraryDto>{ path: path };
        const library = <Library>{ id: id, path: 'test' };

        when(dataStoreMock.save(anyOfClass(Library))).thenResolve(library);

        // Act
        const actual = await service.save(dto);

        // Assert
        expect(actual).toBe(id);

        verify(dataStoreMock.save(anyOfClass(Library))).once();
    });

    test('getById', async () => {
        // Arrange
        const entity = <Library>{ id: 1, path: 'new' };

        when(dataStoreMock.findById(entity.id)).thenResolve(entity);

        // Act
        const dto = await service.getById(entity.id);

        // Assert
        expect(dto.id).toBe(entity.id);
        expect(dto.path).toBe(entity.path);

        verify(dataStoreMock.findById(entity.id)).once();
    });

    test('deleteById', async () => {
        // Arrange
        const id = 1;

        when(dataStoreMock.delete(id)).thenResolve(new DeleteResult());

        // Act
        await service.deleteById(id);

        // Assert
        verify(dataStoreMock.delete(id)).once();
    });

    describe('index', () => {
        test('library exist, then index', async () => {
            // Arrange
            const id = 2;
            const lib = <Library>{ id: id };

            when(dataStoreMock.findById(id)).thenResolve(lib);

            // Act
            await service.index(id);

            // Assert
            verify(indexerMock.index(lib)).once();
        });

        test('library do not exist, then index does not fire', async () => {
            // Arrange
            const id = 2;

            when(dataStoreMock.findById(id)).thenResolve(null);

            // Act
            await service.index(id);

            // Assert
            verify(indexerMock.index(anything())).never();
        });
    });
});