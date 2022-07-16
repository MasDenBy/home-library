import { Injectable, Logger } from '@nestjs/common';

import {
  createReadStream,
  lstatSync,
  ReadStream,
  Stats,
  existsSync,
  mkdirSync,
  unlinkSync,
  readdir,
  writeFile,
  readFile,
  rmSync,
  fstat,
} from 'fs';
import { basename, extname, parse, join, sep, posix } from 'path';
import { promisify } from 'util';
import * as root from 'app-root-path';

@Injectable()
export class FileSystemWrapper {
  private readonly excludedFolders: string[] = ['#recycle', '@eaDir'];

  constructor(private logger: Logger) {}

  public async readFiles(folderPath: string): Promise<string[]> {
    const readdirAsync = promisify(readdir);
    const items = await readdirAsync(folderPath);

    const result: string[] = [];

    for (const item of this.excludeFolders(items)) {
      const fullPath = join(folderPath, item);
      const itemInfo: Stats = this.getPathInfo(fullPath);

      if (itemInfo == null) continue;

      if (itemInfo.isDirectory()) {
        const files = await this.readFiles(fullPath);
        result.push(...files);
      } else if (itemInfo.isFile()) {
        result.push(fullPath);
      }
    }

    return result;
  }

  public basename(filePath: string): string {
    const extension = extname(filePath);

    return basename(filePath, extension);
  }

  public basenameExt(filePath: string): string {
    return basename(filePath);
  }

  public readFileContent(filePath: string): ReadStream {
    return createReadStream(filePath);
  }

  public async readDirectory(folderPath: string): Promise<string[]> {
    const readdirAsync = promisify(readdir);
    const items = await readdirAsync(folderPath);

    const result: string[] = [];

    for (const item of this.excludeFolders(items)) {
      const fullPath = join(folderPath, item);
      const itemInfo: Stats = this.getPathInfo(fullPath);

      if (itemInfo == null) continue;

      if (itemInfo.isDirectory()) {
        result.push(item);
      }
    }

    return result;
  }

  public osRoot(): string {
    return parse(process.cwd()).root.split(sep).join(posix.sep);
  }

  public pathFromAppRoot(folder: string): string {
    return join(root.path, folder);
  }

  public checkOrCreateDirectory(dir: string): void {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  }

  public async writeFile(
    content: string | NodeJS.ArrayBufferView,
    fileName: string,
  ): Promise<void> {
    const writeFileAsync = promisify(writeFile);

    await writeFileAsync(fileName, content);
  }

  public deleteFile(file: string): void {
    unlinkSync(file);
  }

  public deleteFolder(folder: string): void {
    const path = this.pathFromAppRoot(folder);
    if(existsSync(path)) {
      rmSync(path, { force: true, recursive: true });
    }
  }

  public async readFile(filePath: string): Promise<Buffer> {
    const readFileAsync = promisify(readFile);

    return await readFileAsync(filePath);
  }

  private getPathInfo(path: string): Stats {
    try {
      return lstatSync(path);
    } catch (ex) {
      if (ex.code !== 'EPERM' && ex.code !== 'EBUSY') {
        this.logger.error(ex);
      }
    }

    return null;
  }

  private excludeFolders(paths: string[]): string[] {
    return paths.filter((path) => {
      for (const folder of this.excludedFolders) {
        if (path.includes(folder)) return false;
      }

      return true;
    });
  }
}
