import { injectable } from "inversify";
import { FileSystemWrapper } from "./fs.wrapper";
import { Library } from '../dataaccess/entities/library.entity';
import { BookService } from "../../books/services/book.service";

import debug from 'debug';
const debugLog: debug.IDebugger = debug('app:library.indexer.service');

@injectable()
export class IndexerService {
    constructor(private fs: FileSystemWrapper, private bookService: BookService) {}

    public async index(libs: Library[]): Promise<any> {
        for (const index in libs) {
            await this.processLibrary(libs[index]);
        }
    }

    private async processLibrary(library: Library) {
        const files = await this.fs.readFiles(library.path);

        for (const index in files) {
            const file = files[index];

            await this.bookService.createFromFile(file, library);
        }
    }   
}