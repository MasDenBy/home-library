import { injectable } from "inversify";
import { FileSystemWrapper } from "./fs.wrapper";
import { Library } from '../dataaccess/entities/library.entity';
import { BookService } from "../../books/services/book.service";
import { LibraryWatcher } from "../../libraries/services/library.watcher";

import debug from 'debug';
const debugLog: debug.IDebugger = debug('app:library.indexer.service');

@injectable()
export class IndexerService {
    constructor(private fs: FileSystemWrapper, private bookService: BookService,
        private watcher: LibraryWatcher) {}

    public async index(libs: Library[]): Promise<void> {
        for (const index in libs) {
            await this.processLibrary(libs[index]);
            this.watcher.run(libs[index]);
        }
    }

    private async processLibrary(library: Library): Promise<void> {
        const files = await this.fs.readFiles(library.path);

        for (const index in files) {
            const file = files[index];

            await this.bookService.createFromFile(file, library);
        }
    }   
}