import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryDataStore } from './database/library.datastore';
import { Library } from './database/library.entity';
import { LibrariesController } from './libraries.controller';
import { LibraryService } from './services/library.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Library])
    ],
    providers: [
        LibraryDataStore,
        LibraryService
    ],
    controllers: [
        LibrariesController
    ]
})
export class LibrariesModule {}
