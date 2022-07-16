import { Injectable, Logger, Options } from '@nestjs/common';
import { Connection } from 'typeorm';

import { Book } from './book.entity';
import { File } from './file.entity';
import { Metadata } from './metadata.entity';

import { BaseDataStore } from '../../core/database/base.datastore';

@Injectable()
export class BookDataStore extends BaseDataStore<Book> {
  private readonly alias = 'book';

  constructor(
    connection: Connection,
    private readonly logger: Logger) {
    super(connection, Book);
  }

  public async findByIdWithReferences(id: number): Promise<Book> {
    const repository = this.repository;

    return await repository
      .createQueryBuilder(this.alias)
      .leftJoinAndSelect(`${this.alias}.file`, 'file')
      .leftJoinAndSelect('file.library', 'library')
      .leftJoinAndSelect(`${this.alias}.metadata`, 'metadata')
      .where(`${this.alias}.id = :id`, { id: id })
      .getOne();
  }

  public async findByFilePath(path: string): Promise<Book> {
    const file = await this.connection
      .getRepository(File)
      .findOne({ path: path });

    return await this.connection
      .getRepository(Book)
      .findOne({ file: file });
  }

  public async addBook(book: Book): Promise<number> {
    const repository = this.repository;
    const newEntity = await repository.save(book);

    return newEntity.id;
  }

  public async getBooks(offset: number, count: number): Promise<Book[]> {
    const repository = this.repository;

    return await repository
      .createQueryBuilder(this.alias)
      .leftJoinAndSelect(`${this.alias}.file`, 'file')
      .leftJoinAndSelect('file.library', 'library')
      .skip(offset)
      .take(count)
      .getMany();
  }

  public async searchBooks(
    pattern: string,
    offset: number,
    count: number,
  ): Promise<[Book[], number]> {
    const repository = this.repository;

    const builder = repository
      .createQueryBuilder(this.alias)
      .where(`${this.alias}.title LIKE :title`, { title: `%${pattern}%` })
      .orWhere(`${this.alias}.description LIKE :description`, {
        description: `%${pattern}%`,
      })
      .orWhere(`${this.alias}.authors LIKE :authors`, {
        authors: `%${pattern}%`,
      });

    const books = await builder
      .leftJoinAndSelect(`${this.alias}.file`, 'file')
      .leftJoinAndSelect('file.library', 'library')
      .skip(offset)
      .take(count)
      .getMany();

    const totalCount = await builder.getCount();

    return [books, totalCount];
  }

  public async update(book: Book): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (book.metadata) await queryRunner.manager.save(book.metadata);

      if (book.file) await queryRunner.manager.save(book.file);

      await queryRunner.manager.save(book);

      await queryRunner.commitTransaction();
    } catch (ex) {
      this.logger.error(ex);
      await queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }

  public async deleteById(id: number): Promise<void> {
    const book = await this.findByIdWithReferences(id);

    await this.deleteByEntity(File, book.file.id);

    if (book.metadata) {
      await this.deleteByEntity(Metadata, book.metadata.id);
    }

    await this.deleteByEntity(Book, book.id);
  }

  public async deleteByFilePath(path: string): Promise<void> {
    const book = await this.findByFilePath(path);

    await this.deleteById(book.id);
  }
}
