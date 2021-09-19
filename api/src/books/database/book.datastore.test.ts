import {
  mock,
  instance,
  when,
  verify,
  deepEqual,
  anyString,
  anything,
  objectContaining,
} from 'ts-mockito';
import {
  Connection,
  DeleteQueryBuilder,
  Repository,
  SelectQueryBuilder,
  QueryRunner,
  EntityManager,
} from 'typeorm';

import { BookDataStore } from './book.datastore';
import { Book } from './book.entity';
import { File } from './file.entity';
import { Metadata } from './metadata.entity';
//import { resolvableInstance } from '../../__helpers__/ts-mockito.helper';

describe('BookDataStore', () => {
  const id = 10;

  let dataStore: BookDataStore;
  let connectionMock: Connection;
  let bookRepositoryMock: Repository<Book>;

  beforeEach(() => {
    bookRepositoryMock = mock<Repository<Book>>();
    connectionMock = mock(Connection);
    when(connectionMock.getRepository(Book)).thenReturn(
      instance(bookRepositoryMock),
    );

    dataStore = new BookDataStore(instance(connectionMock));
  });

  test('addBook', async () => {
    // Arrange
    const entity = new Book();
    const savedEntity = { id: 1 } as Book;

    when(bookRepositoryMock.save(entity)).thenResolve(savedEntity);

    // Act
    const id = await dataStore.addBook(entity);

    // Assert
    expect(id).toBe(savedEntity.id);

    verify(bookRepositoryMock.save(deepEqual(entity))).once();
  });

  test('getBooks', async () => {
    // Arrange
    const offset = 10;
    const count = 20;

    const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
    when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.skip(offset)).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.take(count)).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.getMany()).thenResolve([new Book()]);

    when(bookRepositoryMock.createQueryBuilder(anyString())).thenReturn(
      instance(selectQueryBuilder),
    );

    // Act
    await dataStore.getBooks(offset, count);

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
    when(selectQueryBuilder.where(anyString(), anything())).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.orWhere(anyString(), anything())).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.skip(offset)).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.take(count)).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.getMany()).thenResolve([new Book()]);

    when(bookRepositoryMock.createQueryBuilder(anyString())).thenReturn(
      instance(selectQueryBuilder),
    );

    // Act
    await dataStore.searchBooks(pattern, offset, count);

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
    const entity = <Book>{
      id: 1,
      authors: 'authors',
      description: 'description',
      title: 'title',
      file: <File>{},
      metadata: <Metadata>{},
    };

    let queryRunnerMock: QueryRunner;
    let entityManagerMock: EntityManager;

    beforeEach(() => {
      entityManagerMock = mock(EntityManager);

      queryRunnerMock = mock<QueryRunner>();
      when(queryRunnerMock.manager).thenReturn(instance(entityManagerMock));

      when(connectionMock.createQueryRunner()).thenReturn(
        instance(queryRunnerMock),
      );
    });

    afterEach(() => {
      verify(queryRunnerMock.connect()).once();
      verify(queryRunnerMock.startTransaction()).once();
      verify(queryRunnerMock.release()).once();
    });

    test('if successfull should commit transaction', async () => {
      // Act
      await dataStore.update(entity);

      // Assert
      verify(queryRunnerMock.commitTransaction()).once();
      verify(queryRunnerMock.rollbackTransaction()).never();
      verify(entityManagerMock.save(anything())).thrice();
    });

    test('if error should rollback transaction', async () => {
      // Arrange
      when(entityManagerMock.save(anything())).thenThrow(new Error());

      // Act
      await dataStore.update(entity);

      // Assert
      verify(queryRunnerMock.commitTransaction()).never();
      verify(queryRunnerMock.rollbackTransaction()).once();
    });
  });

  test('findByIdWithReferences', async () => {
    // Arrange
    const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
    when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(
      instance(selectQueryBuilder),
    );
    when(
      selectQueryBuilder.leftJoinAndSelect(anyString(), 'metadata'),
    ).thenReturn(instance(selectQueryBuilder));
    when(selectQueryBuilder.where(anyString(), anything())).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.getOne()).thenResolve(new Book());

    when(bookRepositoryMock.createQueryBuilder(anyString())).thenReturn(
      instance(selectQueryBuilder),
    );

    // Act
    const result = await dataStore.findByIdWithReferences(id);

    // Assert
    expect(result).not.toBeNull();

    verify(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).once();
    verify(selectQueryBuilder.where(anyString(), anything())).once();
    verify(selectQueryBuilder.getOne()).once();
  });

  test('deleteById', async () => {
    // Arrange
    const deleteQueryBuilder = mock<DeleteQueryBuilder<Book>>();
    when(deleteQueryBuilder.from(anything())).thenReturn(
      instance(deleteQueryBuilder),
    );
    when(
      deleteQueryBuilder.where('id = :id', objectContaining({ id: id })),
    ).thenReturn(instance(deleteQueryBuilder));

    const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
    when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(
      instance(selectQueryBuilder),
    );
    when(
      selectQueryBuilder.leftJoinAndSelect(anyString(), 'metadata'),
    ).thenReturn(instance(selectQueryBuilder));
    when(selectQueryBuilder.where(anyString(), anything())).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.getOne()).thenResolve(<Book>{
      id: id,
      file: { id: id },
    });
    when(selectQueryBuilder.delete()).thenReturn(instance(deleteQueryBuilder));

    when(connectionMock.createQueryBuilder()).thenReturn(
      instance(selectQueryBuilder),
    );

    when(bookRepositoryMock.createQueryBuilder(anyString())).thenReturn(
      instance(selectQueryBuilder),
    );

    // Act
    await dataStore.deleteById(id);

    // Assert
    verify(deleteQueryBuilder.from(anything())).twice();
    verify(deleteQueryBuilder.where(anyString(), anything())).twice();
    verify(deleteQueryBuilder.execute()).twice();
  });

  test('deleteByFilePath', async () => {
    // Arrange
    const deleteQueryBuilder = mock<DeleteQueryBuilder<Book>>();
    when(deleteQueryBuilder.from(anything())).thenReturn(
      instance(deleteQueryBuilder),
    );
    when(
      deleteQueryBuilder.where('id = :id', objectContaining({ id: id })),
    ).thenReturn(instance(deleteQueryBuilder));

    const selectQueryBuilder = mock<SelectQueryBuilder<Book>>();
    when(selectQueryBuilder.leftJoinAndSelect(anyString(), 'file')).thenReturn(
      instance(selectQueryBuilder),
    );
    when(
      selectQueryBuilder.leftJoinAndSelect(anyString(), 'metadata'),
    ).thenReturn(instance(selectQueryBuilder));
    when(selectQueryBuilder.where(anyString(), anything())).thenReturn(
      instance(selectQueryBuilder),
    );
    when(selectQueryBuilder.getOne()).thenResolve(<Book>{
      id: id,
      file: { id: id },
    });
    when(selectQueryBuilder.delete()).thenReturn(instance(deleteQueryBuilder));

    when(bookRepositoryMock.createQueryBuilder(anyString())).thenReturn(
      instance(selectQueryBuilder),
    );
    when(bookRepositoryMock.findOne(anything())).thenResolve(<Book>{ id: id });

    const repositoryFile = mock<Repository<File>>();
    when(repositoryFile.findOne(anything())).thenResolve(<File>{});

    when(connectionMock.createQueryBuilder()).thenReturn(
      instance(selectQueryBuilder),
    );
    when(connectionMock.getRepository(File)).thenReturn(repositoryFile);

    // Act
    await dataStore.deleteByFilePath('path');

    // Assert
    verify(deleteQueryBuilder.from(anything())).twice();
    verify(deleteQueryBuilder.where(anyString(), anything())).twice();
    verify(deleteQueryBuilder.execute()).twice();
  });
});
