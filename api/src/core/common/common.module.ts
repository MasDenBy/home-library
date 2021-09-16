import { Module } from '@nestjs/common';
import { FileSystemWrapper } from './services/fs.wrapper';
import { ImageService } from './services/image.service';

@Module({
    providers: [
        FileSystemWrapper,
        ImageService
    ],
    exports: [
        FileSystemWrapper,
        ImageService
    ]
})
export class CommonModule {}