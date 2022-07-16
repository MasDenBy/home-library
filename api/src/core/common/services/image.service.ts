import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { join, extname } from 'path';

import { FileSystemWrapper } from './fs.wrapper';

@Injectable()
export class ImageService {
  constructor(
    private fs: FileSystemWrapper,
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  public async download(url: string, libraryId: number): Promise<string> {
    const mediumSizeUrl = url.replace('-S.', '-M.');
    const name = `${nanoid()}${extname(url)}`;

    const response = await axios.get(mediumSizeUrl, {
      responseType: 'arraybuffer',
    });

    const imagesDirectoryPath = this.fs.pathFromAppRoot(
      this.getImagesDirectory(libraryId),
    );
    this.fs.checkOrCreateDirectory(imagesDirectoryPath);

    const fileName = join(imagesDirectoryPath, name);

    await this.fs.writeFile(response.data, fileName);

    return name;
  }

  public remove(imageName: string, libraryId: number): void {
    const fullPath = this.getImagePath(imageName, libraryId);

    this.fs.deleteFile(fullPath);
  }

  public async getImageContent(
    imageName: string,
    libraryId: number,
  ): Promise<string> {
    try {
      const imagePath = this.getImagePath(imageName, libraryId);
      const buffer = await this.fs.readFile(imagePath);

      return buffer.toString('base64');
    } catch (ex) {
      this.logger.error(ex);
    }

    return null;
  }

  public getImagePath(imageName: string, libraryId: number): string {
    const imagesDirectoryPath = this.fs.pathFromAppRoot(
      this.getImagesDirectory(libraryId),
    );
    return join(imagesDirectoryPath, imageName);
  }

  public getImagesDirectory(libraryId: number): string {
    return join(
      this.configService.get<string>('IMAGE_DIR'),
      libraryId.toString(),
    );
  }
}
