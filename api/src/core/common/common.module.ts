import { Logger, Module } from '@nestjs/common';
import { FileSystemWrapper } from './services/fs.wrapper';
import { ImageService } from './services/image.service';

@Module({
  providers: [FileSystemWrapper, ImageService, Logger],
  exports: [FileSystemWrapper, ImageService, Logger],
})
export class CommonModule {}
