import "reflect-metadata";

import { BaseEntity } from '../../../src/common/dataaccess/entities/base.entity';
import { DatabaseWrapper } from '../../../src/common/dataaccess/db.wrapper';
import { DataObject } from '../../../src/common/dataaccess/data.object';
import { mock, instance, when, verify, objectContaining } from 'ts-mockito';
import { resolvableInstance } from '../../__helpers__/ts-mockito.helper';
import { Repository, Connection, SelectQueryBuilder, DeleteQueryBuilder, DeleteResult } from 'typeorm';

describe('DataObject', () => {
    let dataObject: TestDataObject;
    let databaseMock: DatabaseWrapper;

    beforeEach(() => {
        databaseMock = mock(DatabaseWrapper);
        dataObject = new TestDataObject(instance(databaseMock));
    });

    test('list', async () => {
        // Arrange
        const repository = mock<Repository<BaseEntity>>();
        when(repository.find()).thenResolve([]);

        when(databaseMock.getRepository(BaseEntity)).thenResolve(resolvableInstance(repository));

        // Act
        await dataObject.list(BaseEntity);

        // Assert
        verify(databaseMock.getRepository(BaseEntity)).once();
        verify(repository.find()).once();
    });

    test('findById', async () => {
        // Arrange
        const id = 1;

        const repository = mock<Repository<BaseEntity>>();
        when(repository.findOne(objectContaining({ id: id }))).thenResolve(instance(mock(BaseEntity)));

        when(databaseMock.getRepository(BaseEntity)).thenResolve(resolvableInstance(repository));

        // Act
        await dataObject.findById(BaseEntity, id);

        // Assert
        verify(databaseMock.getRepository(BaseEntity)).once();
        verify(repository.findOne(objectContaining({ id: id }))).once();
    });

    test('delete', async () => {
        // Arrange
        const id = 1;

        const deleteQueryBuilder = mock<DeleteQueryBuilder<any>>();
        when(deleteQueryBuilder.from(BaseEntity)).thenReturn(instance(deleteQueryBuilder));
        when(deleteQueryBuilder.where('id = :id', objectContaining({id: id}))).thenReturn(instance(deleteQueryBuilder));
        when(deleteQueryBuilder.execute()).thenResolve(new DeleteResult());

        const selectQueryBuilder = mock<SelectQueryBuilder<any>>();
        when(selectQueryBuilder.delete()).thenReturn(instance(deleteQueryBuilder));

        const connection = mock<Connection>();
        when(connection.createQueryBuilder()).thenReturn(instance(selectQueryBuilder));

        when(databaseMock.getConnection()).thenResolve(resolvableInstance(connection));

        // Act
        await dataObject.delete(BaseEntity, id);

        // Assert
        verify(deleteQueryBuilder.from(BaseEntity)).once();
        verify(deleteQueryBuilder.where('id = :id', objectContaining({id: id}))).once();
        verify(deleteQueryBuilder.execute()).once();
        verify(selectQueryBuilder.delete()).once();
    });
});

class TestDataObject extends DataObject { }