import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { BookInfo, SearchResponseDto } from './openlibrary.dto';

@Injectable()
export class OpenLibraryService {
  constructor(private readonly logger: Logger) { }
  private readonly serviceUrl: string = 'http://openlibrary.org';

  public async search(pattern: string): Promise<string> {
    try {
      const response = await axios.get<SearchResponseDto>(
        `${this.serviceUrl}/search.json?q=${OpenLibraryService.preparePattern(
          pattern,
        )}`,
      );
  
      if (response.data.numFound > 0 && response.data.docs[0].isbn?.length > 0) {
        return response.data.docs[0].isbn[0];
      }
    } catch (error) {
      this.logger.error(error);
    }

    return null;
  }

  public async findByIsbn(isbn: string): Promise<BookInfo> {
    try {
      const response = await axios.get(
        `${this.serviceUrl}/api/books?bibkeys=isbn:${isbn}&jscmd=details&format=json`,
      );
  
      if (response.data) {
        return response.data[`isbn:${isbn}`] as BookInfo;
      }
    } catch (error) {
      this.logger.error(error);
    }

    return null;
  }

  private static preparePattern(pattern: string) {
    return pattern.replace(' ', '+');
  }
}
