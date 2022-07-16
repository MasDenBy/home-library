import { Injectable } from '@nestjs/common';
import { FileSystemWrapper } from '../../core/common/services/fs.wrapper';
import { ImageService } from '../../core/common/services/image.service';
import { LibraryDataStore } from '../database/library.datastore';
import { LibraryDto } from '../dto/library.dto';
import { IndexerService } from './indexer.service';

@Injectable()
export class LibraryService {
  constructor(
    private readonly libraryDataStore: LibraryDataStore,
    private readonly indexer: IndexerService,
    private readonly fs: FileSystemWrapper,
    private readonly imageService: ImageService,
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

  public async deleteById(id: number): Promise<void> {
    await this.libraryDataStore.deleteById(id);
    const libraryFolder = this.imageService.getImagesDirectory(id);
    this.fs.deleteFolder(libraryFolder);
  }

  public async index(id: number): Promise<void> {
    const lib = await this.libraryDataStore.findById(id);

    if (lib) {
      await this.indexer.index(lib);
    }
  }
}
