import { Stream } from 'stream';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BookService } from './services/book.service';
import { BookDto } from './dto/book.dto';
import { PageDto } from '../core/common/dto/page.dto';
import { BookSearchDto } from './dto/book.search.dto';
import { ApiOkPageDtoResponse } from '../core/common/decorators/pagedto.decorator';
import { ListQueryDto } from './dto/list.query.dto';

@ApiTags('books')
@Controller('/books')
export class BooksController {
  constructor(private bookService: BookService) {}

  @Get()
  @ApiOkPageDtoResponse(BookDto)
  public list(@Query() query: ListQueryDto): Promise<PageDto<BookDto>> {
    return this.bookService.list(query.offset, query.count);
  }

  @Post('/search')
  @ApiOkPageDtoResponse(BookDto)
  public search(@Body() dto: BookSearchDto): Promise<PageDto<BookDto>> {
    return this.bookService.search(dto);
  }

  @Get(':id')
  @ApiOkResponse({ type: BookDto })
  public getBookById(@Param('id') id: number): Promise<BookDto> {
    return this.bookService.getById(id);
  }

  @Put(':id')
  public async put(
    @Param('id') id: number,
    @Body() dto: BookDto,
  ): Promise<void> {
    await this.bookService.update(id, <BookDto>{ id: id, ...dto });
  }

  @Delete(':id')
  public async removeBook(@Param('id') id: number): Promise<void> {
    await this.bookService.deleteById(id);
  }

  @Get(':id/file')
  public async getBookFile(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<void> {
    const file = await this.bookService.getFile(id);

    await this.fileResponse(file, response);
  }

  @Get(':id/index')
  public async index(@Param('id') id: number): Promise<void> {
    await this.bookService.index(id);
  }

  protected async fileResponse(
    file: [Stream, string],
    response: Response,
  ): Promise<void> {
    response.setHeader('content-type', 'application/octet-stream');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${file[1]}"`,
    );
    response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    file[0].pipe(response);

    await this.streamFinished(file[0]);
  }

  private streamFinished(stream: Stream): Promise<void> {
    return new Promise((resolve, reject) => {
      stream.on('end', (v) => resolve(v));
      stream.on('error', () => reject());
    });
  }
}
