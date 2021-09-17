import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../core/common/common.module';
import { OpenLibraryModule } from '../core/openlibrary/openlibrary.module';
import { BooksController } from './books.controller';
import { BookDataStore } from './database/book.datastore';

import { Book } from './database/book.entity';
import { File } from './database/file.entity';
import { Metadata } from './database/metadata.entity';
import { BookService } from './services/book.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Book, File, Metadata]),
        OpenLibraryModule,
        CommonModule
    ],
    providers: [
        BookDataStore,
        BookService
    ],
    controllers: [
        BooksController
    ],
    exports:[ BookService ]
})
export class BooksModule {}