import chokidar from 'chokidar';
import { injectable } from 'inversify';

import { BookService } from '../../books/services/book.service';
import { Library } from '../../common/dataaccess/entities/library.entity';

import debug from 'debug';
const debugLog: debug.IDebugger = debug('app:library.watcher');

@injectable()
export class LibraryWatcher {
    constructor(private bookService: BookService) { }

    public run(library: Library): void {
        const watcher = chokidar.watch(library.path, {
            ignoreInitial: true
        });

        watcher
            .on('add', async path => {
                debugLog(`File ${path} has been added`);
                await this.bookService.createFromFile(path, library);
            })
            .on('unlink', async path => {
                debugLog(`File ${path} has been removed`);
                await this.bookService.deleteByFilePath(path);
            });
    }
}