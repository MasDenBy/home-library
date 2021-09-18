import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from '../books/books.module';
import { CommonModule } from '../core/common/common.module';
import { LibraryDataStore } from './database/library.datastore';
import { Library } from './database/library.entity';
import { LibrariesController } from './libraries.controller';
import { IndexerService } from './services/indexer.service';
import { LibraryService } from './services/library.service';
import { LibraryWatcher } from './services/library.watcher';

@Module({
  imports: [TypeOrmModule.forFeature([Library]), CommonModule, BooksModule],
  providers: [LibraryDataStore, LibraryService, IndexerService, LibraryWatcher],
  controllers: [LibrariesController],
})
export class LibrariesModule {}
