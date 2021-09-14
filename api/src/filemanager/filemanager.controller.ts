import { Controller, Get, Param } from "@nestjs/common";
import { FolderDto } from "./folder.dto";
import { FileManagerService } from "./services/filemanager.service";

@Controller("/fm")
export class FileManagerController {

    constructor(private fileManagerService: FileManagerService) {}

    @Get()
    public async list(@Param('path') path: string): Promise<FolderDto> {
        return await this.fileManagerService.directoryList(path);
    }
}