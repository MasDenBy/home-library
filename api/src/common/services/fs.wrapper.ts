import fs from 'fs';
import path from 'path';
import util from 'util';

import { injectable } from 'inversify';

import debug from 'debug';

const debugLog: debug.IDebugger = debug('app:fs.wrapper');

@injectable()
export class FileSystemWrapper {
    public async readFiles(folderPath: string): Promise<string[]> {
        const readdirAsync = util.promisify(fs.readdir);
        const items = await readdirAsync(folderPath);

        let result: string[] = [];

        for (const itemIndex in items) {
            const fullPath = path.join(folderPath, items[itemIndex]);
            const itemInfo: fs.Stats = fs.lstatSync(fullPath);

            debugLog(fullPath);

            if (itemInfo.isDirectory()) {
                const files = await this.readFiles(fullPath);
                result.push(...files);
            } else if (itemInfo.isFile()) {
                result.push(fullPath);
            }
        }

        return result;
    }

    public basename(filePath: string) {
        const extension = path.extname(filePath);

        return path.basename(filePath, extension);
    }

    public basenameExt(filePath: string) {
        return path.basename(filePath);
    }

    public readFileContent(filePath: string): fs.ReadStream {
        return fs.createReadStream(filePath);
    }

    public async readDirectory(folderPath: string): Promise<string[]> {
        const readdirAsync = util.promisify(fs.readdir);
        const items = await readdirAsync(folderPath);

        let result: string[] = [];

        for (const itemIndex in items) {
            const fullPath = path.join(folderPath, items[itemIndex]);
            const itemInfo: fs.Stats = fs.lstatSync(fullPath);

            if (itemInfo.isDirectory()) {
                result.push(items[itemIndex]);
            }
        }

        return result;
    }

    public osRoot(): string {
        return path.parse(process.cwd()).root;
    }

    public pathFromRoot(partPath: string) {
        return path.join(this.osRoot(), partPath);
    }
}