import "reflect-metadata";

import { Repository } from 'typeorm';
import { mock, instance, when, verify, deepEqual } from 'ts-mockito';

import { LibraryDataObject } from '../../../src/libraries/dataaccess/library.dataobject';
import { Library } from '../../../src/libraries/dataaccess/library.entity';
import { DatabaseWrapper } from '../../../src/common/dataaccess/db.wrapper';
import { resolvableInstance } from '../../../__helpers__/ts-mockito.helper';

describe('LibraryDataObject', () => {

    let dataObject: LibraryDataObject;
    let databaseMock: DatabaseWrapper;

    beforeEach(() => {
        databaseMock = mock(DatabaseWrapper);
        dataObject = new LibraryDataObject(instance(databaseMock));
    });

    test('save', async () => {
        // Arrange
        const entity = new Library();
        const savedEntity = { id: 1 } as Library;

        const repository = mock<Repository<Library>>();
        when(repository.save(entity)).thenResolve(savedEntity);

        when(databaseMock.getRepository(Library)).thenResolve(resolvableInstance(repository));

        // Act
        const id = await dataObject.save(entity);

        // Assert
        expect(id).toBe(savedEntity.id);

        verify(databaseMock.getRepository(Library)).once();
        verify(repository.save(deepEqual(entity))).once();
    });
});