import { Injectable } from '@nestjs/common';

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
} from 'fs';
import { basename, extname, parse, join } from 'path';
import { promisify } from 'util';
import * as root from 'app-root-path';

@Injectable()
export class FileSystemWrapper {
  public async readFiles(folderPath: string): Promise<string[]> {
    const readdirAsync = promisify(readdir);
    const items = await readdirAsync(folderPath);

    const result: string[] = [];

    for (const itemIndex in items) {
      const fullPath = join(folderPath, items[itemIndex]);
      const itemInfo: Stats = lstatSync(fullPath);

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

    for (const itemIndex in items) {
      const fullPath = join(folderPath, items[itemIndex]);
      try {
        const itemInfo: Stats = lstatSync(fullPath);

        if (itemInfo.isDirectory()) {
          result.push(items[itemIndex]);
        }
      } catch (ex) {
        // Need to log exception!!!
      }
    }

    return result;
  }

  public osRoot(): string {
    return parse(process.cwd()).root;
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

  public async readFile(filePath: string): Promise<Buffer> {
    const readFileAsync = promisify(readFile);

    return await readFileAsync(filePath);
  }
}
