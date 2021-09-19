import { Injectable } from '@nestjs/common';
import { LibraryDataStore } from '../database/library.datastore';
import { LibraryDto } from '../library.dto';
import { IndexerService } from './indexer.service';

@Injectable()
export class LibraryService {
  constructor(
    private libraryDataStore: LibraryDataStore,
    private indexer: IndexerService,
  ) {}

  public list(): Promise<LibraryDto[]> {
    return this.libraryDataStore
      .list()
      .then((items) => items.map((x) => LibraryDto.fromEntity(x)));
  }

  public async save(dto: LibraryDto): Promise<number> {
    const entity = LibraryDto.toEntity(dto);

    return await this.libraryDataStore.save(entity).then((x) => x.id);
  }

  public async getById(id: number): Promise<LibraryDto> {
    const entity = await this.libraryDataStore.findById(id);

    return LibraryDto.fromEntity(entity);
  }

  public async deleteById(id: number): Promise<unknown> {
    return await this.libraryDataStore.delete(id);
  }

  public async index(id: number): Promise<void> {
    const lib = await this.libraryDataStore.findById(id);

    if (lib) {
      await this.indexer.index(lib);
    }
  }
}
