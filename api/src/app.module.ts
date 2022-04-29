import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BooksModule } from './books/books.module';
import { CommonModule } from './core/common/common.module';
import { DatabaseModule } from './core/database/database.module';
import { FileManagerModule } from './filemanager/filemanager.module';
import { LibrariesModule } from './libraries/libraries.module';

import configuration from './core/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BooksModule,
    CommonModule,
    DatabaseModule,
    FileManagerModule,
    LibrariesModule,
  ],
  providers: [Logger]
})
export class AppModule {}
