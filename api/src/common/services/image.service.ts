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
        const imagesDirectoryPath = this.fs.pathFromAppRoot(this.imagesDirectoryName);
        const fullPath = path.join(imagesDirectoryPath, imageName);

        this.fs.deleteFile(fullPath);
    }
}