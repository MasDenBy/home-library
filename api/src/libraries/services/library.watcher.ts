import { Injectable } from '@nestjs/common';
import { watch } from 'chokidar';

import { BookService } from '../../books/services/book.service';
import { Library } from '../database/library.entity';

@Injectable()
export class LibraryWatcher {
    constructor(private bookService: BookService) { }

    public run(library: Library): void {
        const watcher = watch(library.path, {
            ignoreInitial: true
        });

        watcher
            .on('add', async path => {
                await this.bookService.createFromFile(path, library);
            })
            .on('unlink', async path => {
                await this.bookService.deleteByFilePath(path);
            });
    }
}