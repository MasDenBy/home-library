import { injectable } from "inversify";
import axios from 'axios';
import { nanoid } from 'nanoid'
import path from 'path';

import { FileSystemWrapper } from "./fs.wrapper";

@injectable()
export class ImageService {
    private readonly imagesDirectoryName: string = 'assets/images';
    constructor(private fs: FileSystemWrapper){}

    public async download(url: string): Promise<string> {
        const mediumSizeUrl = url.replace('-S.', '-M.');
        const name = nanoid();

        const response = await axios.get(mediumSizeUrl, { responseType: 'arraybuffer' });

        const imagesDirectoryPath = this.fs.pathFromAppRoot(this.imagesDirectoryName);
        this.fs.checkOrCreateDirectory(imagesDirectoryPath);

        await this.fs.writeFile(response.data, path.join(imagesDirectoryPath, name));

        return name;
    }

    public remove(imageName: string): void {
        const fullPath = this.getImagePath(imageName);

        this.fs.deleteFile(fullPath);
    }

    public async getImageContent(imageName: string): Promise<string> {
        const imagePath = this.getImagePath(imageName);
        const buffer = await this.fs.readFile(imagePath);

        return buffer.toString('base64');
    }

    private getImagePath(imageName: string): string {
        const imagesDirectoryPath = this.fs.pathFromAppRoot(this.imagesDirectoryName);
        return path.join(imagesDirectoryPath, imageName);
    }
}