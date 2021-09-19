import { Connection, DeleteResult, EntityTarget } from 'typeorm';

export abstract class BaseDataStore<T> {
  constructor(
    protected connection: Connection,
    private target: EntityTarget<T>,
  ) {}

  public list(): Promise<T[]> {
    return this.repository.find() as Promise<T[]>;
  }

  public findById(id: number): Promise<T> {
    return this.repository.findOne(id) as Promise<T>;
  }

  public delete(id: number): Promise<DeleteResult> {
    return this.deleteByEntity(this.target, id);
  }

  public deleteByEntity<TEntity>(
    target: EntityTarget<TEntity>,
    id: number,
  ): Promise<DeleteResult> {
    return this.connection
      .createQueryBuilder()
      .delete()
      .from(target)
      .where('id = :id', { id: id })
      .execute();
  }

  public count(): Promise<number> {
    return this.repository.count();
  }

  public save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  public get repository() {
    return this.connection.getRepository(this.target);
  }
}
