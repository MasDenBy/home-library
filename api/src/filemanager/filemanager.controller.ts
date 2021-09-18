import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FolderDto } from './folder.dto';
import { FileManagerService } from './services/filemanager.service';

@ApiTags('file manager')
@Controller('/fm')
export class FileManagerController {
  constructor(private fileManagerService: FileManagerService) {}

  @Get()
  @ApiOkResponse({ type: FolderDto })
  public async list(@Param('path') path: string): Promise<FolderDto> {
    return await this.fileManagerService.directoryList(path);
  }
}
