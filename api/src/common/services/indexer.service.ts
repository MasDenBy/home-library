import { injectable } from "inversify";
import { FileSystemWrapper } from "./fs.wrapper";
import { Library } from '../dataaccess/entities/library.entity';
import { BookService } from "../../books/services/book.service";
import { LibraryWatcher } from "../../libraries/services/library.watcher";

@injectable()
export class IndexerService {
    constructor(private fs: FileSystemWrapper, private bookService: BookService,
        private watcher: LibraryWatcher) {}

    public async index(lib: Library): Promise<void> {
        await this.processLibrary(lib);
        this.watcher.run(lib);
    }

    private async processLibrary(library: Library): Promise<void> {
        const files = await this.fs.readFiles(library.path);

        for (const index in files) {
            const file = files[index];

            await this.bookService.createFromFile(file, library);
        }
    }
}