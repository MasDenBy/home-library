import fs from 'fs';
import path from 'path';
import util from 'util';
import * as root from 'app-root-path';

import { injectable } from 'inversify';

import debug from 'debug';

const debugLog: debug.IDebugger = debug('app:fs.wrapper');

@injectable()
export class FileSystemWrapper {
    public async readFiles(folderPath: string): Promise<string[]> {
        const readdirAsync = util.promisify(fs.readdir);
        const items = await readdirAsync(folderPath);

        const result: string[] = [];

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

    public basename(filePath: string): string {
        const extension = path.extname(filePath);

        return path.basename(filePath, extension);
    }

    public basenameExt(filePath: string): string {
        return path.basename(filePath);
    }

    public readFileContent(filePath: string): fs.ReadStream {
        return fs.createReadStream(filePath);
    }

    public async readDirectory(folderPath: string): Promise<string[]> {
        const readdirAsync = util.promisify(fs.readdir);
        const items = await readdirAsync(folderPath);

        const result: string[] = [];

        for (const itemIndex in items) {
            const fullPath = path.join(folderPath, items[itemIndex]);
            try {
                const itemInfo: fs.Stats = fs.lstatSync(fullPath);

                if (itemInfo.isDirectory()) {
                    result.push(items[itemIndex]);
                }
            } catch (ex) {
                debugLog(ex);
            }
            
        }

        return result;
    }

    public osRoot(): string {
        return path.parse(process.cwd()).root;
    }

    public pathFromAppRoot(folder: string): string {
        return path.join(root.path, folder);
    }

    public checkOrCreateDirectory(dir: string): void {
        if(!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive:true });
    }

    public async writeFile(content: string | NodeJS.ArrayBufferView, fileName: string): Promise<void> {
        const writeFileAsync = util.promisify(fs.writeFile);

        await writeFileAsync(fileName, content);
    }

    public deleteFile(file: string): void {
        fs.unlinkSync(file);
    }

    public async readFile(filePath: string): Promise<Buffer> {
        const readFileAsync = util.promisify(fs.readFile);

        return await readFileAsync(filePath);
    }
}