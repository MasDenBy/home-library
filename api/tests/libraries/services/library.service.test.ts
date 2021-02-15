import { DeleteResult } from 'typeorm';
import { mock, instance, when, verify, anyOfClass, anything } from 'ts-mockito';

import { LibraryDataObject } from '../../../src/libraries/dataaccess/library.dataobject';
import { Library } from '../../../src/common/dataaccess/entities/library.entity';
import { LibraryService } from '../../../src/libraries/services/library.service';
import { LibraryDto } from '../../../src/libraries/dto/library.dto';
import { IndexerService } from '../../../src/common/services/indexer.service';

describe('LibraryService', () => {

    let service: LibraryService;
    let dataObjectMock: LibraryDataObject;
    let indexerMock: IndexerService;

    beforeEach(() => {
        dataObjectMock = mock(LibraryDataObject);
        indexerMock = mock(IndexerService);

        service = new LibraryService(instance(dataObjectMock), instance(indexerMock));
    });

    test('list', async () => {
        // Arrange
        when(dataObjectMock.list(Library)).thenResolve([]);

        // Act
        await service.list();

        // Assert
        verify(dataObjectMock.list(Library)).once();
    });

    test('save', async () => {
        // Arrange
        const id = 1;
        const dto = <LibraryDto>{ path: 'new' };

        when(dataObjectMock.save(anyOfClass(Library))).thenResolve(id);

        // Act
        var actual = await service.save(dto);

        // Assert
        expect(actual).toBe(id);

        verify(dataObjectMock.save(anyOfClass(Library))).once();
    });

    test('getById', async () => {
        // Arrange
        const entity = <Library>{ id: 1, path: 'new' };

        when(dataObjectMock.findById(Library, entity.id)).thenResolve(entity);

        // Act
        var dto = await service.getById(entity.id);

        // Assert
        expect(dto.id).toBe(entity.id);
        expect(dto.path).toBe(entity.path);

        verify(dataObjectMock.findById(Library, entity.id)).once();
    });

    test('deleteById', async () => {
        // Arrange
        const id = 1;

        when(dataObjectMock.delete(Library, id)).thenResolve(new DeleteResult());

        // Act
        await service.deleteById(id);

        // Assert
        verify(dataObjectMock.delete(Library, id)).once();
    });

    describe('index', () => {
        test('libraries exist, then index', async () => {
            // Arrange
            const ids = [2];
            const libs = [<Library>{ id: 1 }];
    
            when(dataObjectMock.getByIds(ids)).thenResolve(libs);
            
            // Act
            await service.index(ids);
    
            // Assert
            verify(indexerMock.index(libs)).once();
        });

        test('libraries do not exist, then index does not fire', async () => {
            // Arrange
            const ids = [2];
    
            when(dataObjectMock.getByIds(ids)).thenResolve(null);
            
            // Act
            await service.index(ids);
    
            // Assert
            verify(indexerMock.index(anything())).never();
        });
    });
});