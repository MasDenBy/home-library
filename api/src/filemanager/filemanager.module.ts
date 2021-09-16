import { Module } from '@nestjs/common';
import { CommonModule } from 'src/core/common/common.module';
import { FileManagerController } from './filemanager.controller';
import { FileManagerService } from './services/filemanager.service';

@Module({
    imports: [CommonModule],
    providers: [FileManagerService],
    controllers: [ FileManagerController ]
})
export class FileManagerModule {}