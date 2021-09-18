import { Injectable } from '@nestjs/common';
import { FileSystemWrapper } from '../../core/common/services/fs.wrapper';
import { FolderDto } from '../folder.dto';

@Injectable()
export class FileManagerService {
  constructor(private fs: FileSystemWrapper) {}

  public async directoryList(path: string): Promise<FolderDto> {
    if (!path) {
      path = this.fs.osRoot();
    }

    const folders = await this.fs.readDirectory(path);

    return <FolderDto>{
      path: path,
      folders: folders,
    };
  }
}
