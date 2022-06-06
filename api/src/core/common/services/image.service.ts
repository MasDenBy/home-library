import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { join } from 'path';

import { FileSystemWrapper } from './fs.wrapper';

@Injectable()
export class ImageService {
  constructor(
    private fs: FileSystemWrapper,
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  public async download(url: string): Promise<string> {
    const mediumSizeUrl = url.replace('-S.', '-M.');
    const name = nanoid();

    const response = await axios.get(mediumSizeUrl, {
      responseType: 'arraybuffer',
    });

    const imagesDirectoryPath = this.fs.pathFromAppRoot(this.imagesDirectory);
    this.fs.checkOrCreateDirectory(imagesDirectoryPath);

    const fileName = join(imagesDirectoryPath, name);

    await this.fs.writeFile(response.data, fileName);

    return name;
  }

  public remove(imageName: string): void {
    const fullPath = this.getImagePath(imageName);

    this.fs.deleteFile(fullPath);
  }

  public async getImageContent(imageName: string): Promise<string> {
    try {
      const imagePath = this.getImagePath(imageName);
      const buffer = await this.fs.readFile(imagePath);

      return buffer.toString('base64');
    } catch (ex) {
      this.logger.error(ex);
    }

    return null;
  }

  private get imagesDirectory() {
    return this.configService.get<string>('IMAGE_DIR');
  }

  private getImagePath(imageName: string): string {
    const imagesDirectoryPath = this.fs.pathFromAppRoot(this.imagesDirectory);
    return join(imagesDirectoryPath, imageName);
  }
}
