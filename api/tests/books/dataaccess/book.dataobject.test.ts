import { mock, instance, when, verify, deepEqual } from 'ts-mockito';
import { Repository } from 'typeorm';

import { BookDataObject } from '../../../src/books/dataaccess/book.dataobject';
import { DatabaseWrapper } from '../../../src/common/dataaccess/db.wrapper';
import { Book } from '../../../src/common/dataaccess/entities/book.entity';
import { resolvableInstance } from '../../__helpers__/ts-mockito.helper';

describe('BookDataObject', () => {
    let dataObject: BookDataObject;
    let databaseMock: DatabaseWrapper;

    beforeEach(()=> {
        databaseMock = mock(DatabaseWrapper);
        dataObject = new BookDataObject(instance(databaseMock));
    });

    test('addBook', async () => {
        const entity = new Book();
        const savedEntity = { id: 1 } as Book;

        const repository = mock<Repository<Book>>();
        when(repository.save(entity)).thenResolve(savedEntity);

        when(databaseMock.getRepository(Book)).thenResolve(resolvableInstance(repository));

        // Act
        const id = await dataObject.addBook(entity);

        // Assert
        expect(id).toBe(savedEntity.id);

        verify(databaseMock.getRepository(Book)).once();
        verify(repository.save(deepEqual(entity))).once();
    });
});