import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { Book } from '../../books/database/book.entity';
import { Library } from './library.entity';
import { File } from '../../books/database/file.entity';
import { Metadata } from '../../books/database/metadata.entity';

import { BaseDataStore } from '../../core/database/base.datastore';

@Injectable()
export class LibraryDataStore extends BaseDataStore<Library> {
  constructor(connection: Connection) {
    super(connection, Library);
  }

  public async deleteById(id: number): Promise<void> {
    const bookAlias = 'book';

    await this.connection.createEntityManager().transaction(async (manager) => {
      const books = await manager
        .createQueryBuilder(Book, bookAlias)
        .leftJoinAndSelect(`${bookAlias}.file`, 'file')
        .leftJoinAndSelect(`${bookAlias}.metadata`, 'metadata')
        .where(`file.libraryid = :id`, { id: id })
        .getMany();

      if (!books) return;

      for (const book of books) {
        await manager
          .createQueryBuilder()
          .delete()
          .from(File)
          .where('id = :id', { id: book.file.id })
          .execute();

        if (book.metadata) {
          await manager
            .createQueryBuilder()
            .delete()
            .from(Metadata)
            .where('id = :id', { id: book.metadata.id })
            .execute();
        }

        await manager
          .createQueryBuilder()
          .delete()
          .from(Book)
          .where('id = :id', { id: book.id })
          .execute();
      }

      await manager
        .createQueryBuilder()
        .delete()
        .from(Library)
        .where('id = :id', { id: id })
        .execute();
    });
  }
}
