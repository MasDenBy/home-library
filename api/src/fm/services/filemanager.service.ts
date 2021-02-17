import { injectable } from "inversify";
import { FileSystemWrapper } from "../../common/services/fs.wrapper";
import { FolderDto } from "../dto/folder.dto";

@injectable()
export class FileManagerService {
    constructor(private fs: FileSystemWrapper) { }

    public async directoryList(path: string): Promise<FolderDto> {
        if(!path) {
            path = this.fs.osRoot();
        }

        const folders = await this.fs.readDirectory(path);

        return <FolderDto> {
            path: path,
            folders: folders
        };
    }
}