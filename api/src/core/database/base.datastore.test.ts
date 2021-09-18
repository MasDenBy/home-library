import { BaseDataStore } from './base.datastore';
import {
  Connection,
  DeleteQueryBuilder,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { mock, instance, when, verify, objectContaining } from 'ts-mockito';

describe('BaseDataStore', () => {
  let dataStore: TestDataStore;
  let connection: Connection;
  let repository: Repository<TestEntity>;

  beforeEach(async () => {
    repository = mock<Repository<TestEntity>>();

    connection = mock(Connection);
    when(connection.getRepository(TestEntity)).thenReturn(instance(repository));

    dataStore = new TestDataStore(instance(connection));
  });

  test('list', async () => {
    // Arrange
    when(repository.find()).thenResolve([]);

    // Act
    await dataStore.list();

    // Assert
    verify(repository.find()).once();
  });

  test('findById', async () => {
    // Arrange
    const id = 1;

    when(repository.findOne(id)).thenResolve(new TestEntity());

    // Act
    await dataStore.findById(id);

    // Assert
    verify(repository.findOne(id)).once();
  });

  test('delete', async () => {
    // Arrange
    const id = 1;

    const deleteQueryBuilder = mock<DeleteQueryBuilder<TestEntity>>();
    when(deleteQueryBuilder.from(TestEntity)).thenReturn(
      instance(deleteQueryBuilder),
    );
    when(
      deleteQueryBuilder.where('id = :id', objectContaining({ id: id })),
    ).thenReturn(instance(deleteQueryBuilder));
    when(deleteQueryBuilder.execute()).thenResolve(new DeleteResult());

    const selectQueryBuilder = mock<SelectQueryBuilder<TestEntity>>();
    when(selectQueryBuilder.delete()).thenReturn(instance(deleteQueryBuilder));

    when(connection.createQueryBuilder()).thenReturn(
      instance(selectQueryBuilder),
    );

    // Act
    await dataStore.delete(id);

    // Assert
    verify(deleteQueryBuilder.from(TestEntity)).once();
    verify(
      deleteQueryBuilder.where('id = :id', objectContaining({ id: id })),
    ).once();
    verify(deleteQueryBuilder.execute()).once();
    verify(selectQueryBuilder.delete()).once();
  });

  test('count', async () => {
    // Arrange
    when(repository.count()).thenResolve(1000);

    // Act
    await dataStore.count();

    // Assert
    verify(repository.count()).once();
  });
});

class TestDataStore extends BaseDataStore<TestEntity> {
  constructor(connection: Connection) {
    super(connection, TestEntity);
  }
}
class TestEntity {}
