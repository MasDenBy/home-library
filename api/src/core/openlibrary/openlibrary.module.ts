import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { OpenLibraryService } from './openlibrary.service';

@Module({
  providers: [OpenLibraryService],
  exports: [OpenLibraryService],
  imports: [CommonModule],
})
export class OpenLibraryModule {}
