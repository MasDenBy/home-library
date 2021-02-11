import { mock, instance, when, verify, deepEqual, anyString, anything } from 'ts-mockito';
import { Repository, SelectQueryBuilder, UpdateQueryBuilder, UpdateResult } from 'typeorm';

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
        // Arrange
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

    test('getBooks', async () => {
        // Arrange
        const offset = 10;
        const count = 20;

        const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
        when(selectQueryBuilder.skip(offset)).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.take(count)).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.getMany()).thenResolve([new Book()]);

        const repository = mock<Repository<Book>>();
        when(repository.createQueryBuilder(anyString())).thenReturn(instance(selectQueryBuilder));

        when(databaseMock.getRepository(Book)).thenResolve(resolvableInstance(repository));

        // Act
        const result = await dataObject.getBooks(offset, count);

        // Assert
        expect(result.length).toBe(1);

        verify(selectQueryBuilder.skip(offset)).once();
        verify(selectQueryBuilder.take(count)).once();
        verify(selectQueryBuilder.getMany()).once();
    });

    test('searchBooks', async () => {
        // Arrange
        const offset = 10;
        const count = 20;
        const pattern = 'book';

        const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
        when(selectQueryBuilder.where(anyString(), anything())).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.orWhere(anyString(), anything())).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.skip(offset)).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.take(count)).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.getMany()).thenResolve([new Book()]);

        const repository = mock<Repository<Book>>();
        when(repository.createQueryBuilder(anyString())).thenReturn(instance(selectQueryBuilder));

        when(databaseMock.getRepository(Book)).thenResolve(resolvableInstance(repository));

        // Act
        const result = await dataObject.searchBooks(pattern, offset, count);

        // Assert
        expect(result.length).toBe(1);

        verify(selectQueryBuilder.where(anyString(), anything())).once();
        verify(selectQueryBuilder.orWhere(anyString(), anything())).twice();
        verify(selectQueryBuilder.skip(offset)).once();
        verify(selectQueryBuilder.take(count)).once();
        verify(selectQueryBuilder.getMany()).once();
    });

    test('update', async () => {
        // Arrange
        const entity = <Book>{id:1, authors: 'authors', description: 'description', title: 'title'};
        const setObject = { title: entity.title, authors: entity.authors, description: entity.description };
        
        const updateQueryBuilder = mock<UpdateQueryBuilder<Book>>();
        when(updateQueryBuilder.set(deepEqual(setObject)))
            .thenReturn(instance(updateQueryBuilder));
        when(updateQueryBuilder.where("id = :id", deepEqual({ id: entity.id }))).thenReturn(instance(updateQueryBuilder));
        when(updateQueryBuilder.execute()).thenResolve(new UpdateResult());

        const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
        when(selectQueryBuilder.update(Book)).thenReturn(instance(updateQueryBuilder));

        const repository = mock<Repository<Book>>();
        when(repository.createQueryBuilder()).thenReturn(instance(selectQueryBuilder));

        when(databaseMock.getRepository(Book)).thenResolve(resolvableInstance(repository));

        // Act
        await dataObject.update(entity);

        // Assert
        verify(updateQueryBuilder.set(deepEqual(setObject))).once();
        verify(updateQueryBuilder.where("id = :id", deepEqual({ id: entity.id }))).once();
        verify(updateQueryBuilder.execute()).once();
    });
});