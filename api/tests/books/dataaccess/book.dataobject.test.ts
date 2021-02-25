import { mock, instance, when, verify, deepEqual, anyString, anything, objectContaining } from 'ts-mockito';
import { Connection, DeleteQueryBuilder, Repository, SelectQueryBuilder, QueryRunner, EntityManager } from 'typeorm';

import { BookDataObject } from '../../../src/books/dataaccess/book.dataobject';
import { DatabaseWrapper } from '../../../src/common/dataaccess/db.wrapper';
import { Book } from '../../../src/common/dataaccess/entities/book.entity';
import { File } from '../../../src/common/dataaccess/entities/file.entity';
import { Metadata } from '../../../src/common/dataaccess/entities/metadata.entity';
import { resolvableInstance } from '../../__helpers__/ts-mockito.helper';

describe('BookDataObject', () => {
    const id = 10;

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
        when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.skip(offset)).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.take(count)).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.getMany()).thenResolve([new Book()]);

        const repository = mock<Repository<Book>>();
        when(repository.createQueryBuilder(anyString())).thenReturn(instance(selectQueryBuilder));

        when(databaseMock.getRepository(Book)).thenResolve(resolvableInstance(repository));

        // Act
        await dataObject.getBooks(offset, count);

        // Assert

        verify(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).once();
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
        when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.skip(offset)).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.take(count)).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.getMany()).thenResolve([new Book()]);

        const repository = mock<Repository<Book>>();
        when(repository.createQueryBuilder(anyString())).thenReturn(instance(selectQueryBuilder));

        when(databaseMock.getRepository(Book)).thenResolve(resolvableInstance(repository));

        // Act
        await dataObject.searchBooks(pattern, offset, count);

        // Assert
        verify(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).once();
        verify(selectQueryBuilder.where(anyString(), anything())).once();
        verify(selectQueryBuilder.orWhere(anyString(), anything())).twice();
        verify(selectQueryBuilder.skip(offset)).once();
        verify(selectQueryBuilder.take(count)).once();
        verify(selectQueryBuilder.getMany()).once();
        verify(selectQueryBuilder.getCount()).once();
    });

    describe('update', () => {
        const entity = <Book> {
            id:1, 
            authors: 'authors', 
            description: 'description', 
            title: 'title',
            file: <File>{},
            metadata: <Metadata>{}
        };

        let connectionMock: Connection;
        let queryRunnerMock: QueryRunner;
        let entityManagerMock: EntityManager;

        beforeEach(() => {
            entityManagerMock = mock(EntityManager);
    
            queryRunnerMock = mock<QueryRunner>();
            when(queryRunnerMock.manager).thenReturn(instance(entityManagerMock));
    
            connectionMock = mock<Connection>();
            when(connectionMock.createQueryRunner()).thenReturn(instance(queryRunnerMock));
    
            when(databaseMock.getConnection()).thenResolve(resolvableInstance(connectionMock));
        });

        afterEach(() => {
            verify(queryRunnerMock.connect()).once();
            verify(queryRunnerMock.startTransaction()).once();
            verify(queryRunnerMock.release()).once();
        });

        test('if successfull should commit transaction', async () => {
            // Act
            await dataObject.update(entity);
    
            // Assert            
            verify(queryRunnerMock.commitTransaction()).once();
            verify(queryRunnerMock.rollbackTransaction()).never();
            verify(entityManagerMock.save(anything())).thrice();
        });

        test('if error should rollback transaction', async () => {
            // Arrange
            when(entityManagerMock.save(anything())).thenThrow(new Error());

            // Act
            await dataObject.update(entity);
    
            // Assert
            verify(queryRunnerMock.commitTransaction()).never();
            verify(queryRunnerMock.rollbackTransaction()).once();
        });
    });

    test('findByIdWithReferences', async () => {
        // Arrange
        const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
        when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'metadata')).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.where(anyString(), anything())).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.getOne()).thenResolve(new Book());

        const repository = mock<Repository<Book>>();
        when(repository.createQueryBuilder(anyString())).thenReturn(instance(selectQueryBuilder));

        when(databaseMock.getRepository(Book)).thenResolve(resolvableInstance(repository));

        // Act
        const result = await dataObject.findByIdWithReferences(id);

        // Assert
        expect(result).not.toBeNull();

        verify(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).once();
        verify(selectQueryBuilder.where(anyString(), anything())).once();
        verify(selectQueryBuilder.getOne()).once();
    });

    test('deleteById', async () => {
        // Arrange
        const deleteQueryBuilder = mock<DeleteQueryBuilder<Book>>();
        when(deleteQueryBuilder.from(anything())).thenReturn(instance(deleteQueryBuilder));
        when(deleteQueryBuilder.where('id = :id', objectContaining({id: id}))).thenReturn(instance(deleteQueryBuilder));

        const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
        when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'metadata')).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.where(anyString(), anything())).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.getOne()).thenResolve(<Book>{ id: id, file: { id: id } });
        when(selectQueryBuilder.delete()).thenReturn(instance(deleteQueryBuilder));

        const connection = mock<Connection>();
        when(connection.createQueryBuilder()).thenReturn(instance(selectQueryBuilder));

        const repository = mock<Repository<Book>>();
        when(repository.createQueryBuilder(anyString())).thenReturn(instance(selectQueryBuilder));

        when(databaseMock.getRepository(Book)).thenResolve(resolvableInstance(repository));
        when(databaseMock.getConnection()).thenResolve(resolvableInstance(connection));

        // Act
        await dataObject.deleteById(id);

        // Assert
        verify(deleteQueryBuilder.from(anything())).twice();
        verify(deleteQueryBuilder.where(anyString(), anything())).twice();
        verify(deleteQueryBuilder.execute()).twice();
    });

    test('deleteByFilePath', async () => {
        // Arrange
        const deleteQueryBuilder = mock<DeleteQueryBuilder<Book>>();
        when(deleteQueryBuilder.from(anything())).thenReturn(instance(deleteQueryBuilder));
        when(deleteQueryBuilder.where('id = :id', objectContaining({id: id}))).thenReturn(instance(deleteQueryBuilder));

        const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
        when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'metadata')).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.where(anyString(), anything())).thenReturn(instance(selectQueryBuilder));
        when(selectQueryBuilder.getOne()).thenResolve(<Book>{ id: id, file: { id: id } });
        when(selectQueryBuilder.delete()).thenReturn(instance(deleteQueryBuilder));

        const repositoryBook = mock<Repository<Book>>();
        when(repositoryBook.createQueryBuilder(anyString())).thenReturn(instance(selectQueryBuilder));
        when(repositoryBook.findOne(anything())).thenResolve(<Book>{ id: id });

        const repositoryFile = mock<Repository<File>>();
        when(repositoryFile.findOne(anything())).thenResolve(<File>{});

        const connection = mock<Connection>();
        when(connection.createQueryBuilder()).thenReturn(instance(selectQueryBuilder));
        when(connection.getRepository(Book)).thenReturn(repositoryBook);
        when(connection.getRepository(File)).thenReturn(repositoryFile);

        when(databaseMock.getRepository(Book)).thenResolve(resolvableInstance(repositoryBook));
        when(databaseMock.getConnection()).thenResolve(resolvableInstance(connection));

        // Act
        await dataObject.deleteByFilePath('path');

        // Assert
        verify(deleteQueryBuilder.from(anything())).twice();
        verify(deleteQueryBuilder.where(anyString(), anything())).twice();
        verify(deleteQueryBuilder.execute()).twice();
    });
});