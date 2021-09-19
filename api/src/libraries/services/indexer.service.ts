import { FileSystemWrapper } from '../../core/common/services/fs.wrapper';
import { Library } from '../database/library.entity';
import { BookService } from '../../books/services/book.service';
import { LibraryWatcher } from '../../libraries/services/library.watcher';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IndexerService {
  constructor(
    private fs: FileSystemWrapper,
    private bookService: BookService,
    private watcher: LibraryWatcher,
  ) {}

  public async index(lib: Library): Promise<void> {
    await this.processLibrary(lib);
    this.watcher.run(lib);
  }

  private async processLibrary(library: Library): Promise<void> {
    const files = await this.fs.readFiles(library.path);

    for (const index in files) {
      const file = files[index];

      const id = await this.bookService.createFromFile(file, library);
      this.bookService.index(id);
    }
  }
}
