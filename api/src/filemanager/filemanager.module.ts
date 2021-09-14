import { Module } from '@nestjs/common';
import { FileManagerController } from './filemanager.controller';

@Module({
    controllers: [ FileManagerController ]
})
export class FileManagerModule {}