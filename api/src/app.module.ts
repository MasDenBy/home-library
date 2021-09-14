import { Module } from '@nestjs/common';
import { CommonModule } from './core/common/common.module';
import { DatabaseModule } from './core/database/database.module';
import { FileManagerModule } from './filemanager/filemanager.module';
import { LibrariesModule } from './libraries/libraries.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    FileManagerModule,
    LibrariesModule
  ]
})
export class AppModule {}
