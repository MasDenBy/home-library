import { Module } from '@nestjs/common';
import { FileSystemWrapper } from './services/fs.wrapper';

@Module({
    providers: [
        FileSystemWrapper
    ],
    exports: [
        FileSystemWrapper
    ]
})
export class CommonModule {}