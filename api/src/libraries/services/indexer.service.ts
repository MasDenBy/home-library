import { FileSystemWrapper } from '../../core/common/services/fs.wrapper';
import { Library } from '../database/library.entity';
import { BookService } from '../../books/services/book.service';
import { LibraryWatcher } from '../../libraries/services/library.watcher';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IndexerService {
  private readonly bookFileExtensions: string[] = ['.docx', '.doc', '.epub', '.pdf', '.djvu', '.txt', '.fb2', '.azw3', '.mobi', '.azw4', '.azw', '.rtf'];
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

    for (const file of files.filter(x => this.isBook(x))) {
      const id = await this.bookService.createFromFile(file, library);
      this.bookService.index(id);
    }
  }

  private isBook(fileName: string): boolean {
    var ext = fileName.substring(fileName.lastIndexOf('.'))
                      .toLowerCase();

    return this.bookFileExtensions.includes(ext);
  }
}
