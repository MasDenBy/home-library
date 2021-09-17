import { Response } from 'express';
import { BookService } from './services/book.service';
import { BookDto } from './dto/book.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { IPage } from '../core/common/dto/page.dto';
import { BookSearchDto } from './dto/book.search.dto';
import { Stream } from 'stream';

@Controller("/books")
export class BooksController {
    constructor(private bookService: BookService) {}

    @Get()
    public list(@Query('offset') offset: number, @Query('count') count: number): Promise<IPage<BookDto>> {
        return this.bookService.list(offset, count);
    }

    @Post('/search')
    public search(@Body() dto: BookSearchDto): Promise<IPage<BookDto>> {
        return this.bookService.search(dto);
    }

    @Get(':id')
    public getBookById(@Param('id') id: number): Promise<BookDto> {
        return this.bookService.getById(id);
    }

    @Put(':id')
    public async put(@Param('id') id: number, @Body() dto: BookDto): Promise<void> {
        await this.bookService.update(id, <BookDto>{id: id, ...dto});
    }

    @Delete(':id')
    public async removeBook(@Param('id') id: number): Promise<void> {
        await this.bookService.deleteById(id);
    }

    @Get(':id/file')
    public async getBookFile(@Param('id') id: number, @Res() response: Response): Promise<void> {
        const file = await this.bookService.getFile(id);

        await this.fileResponse(file, response);
    }

    @Get(':id/index')
    public async index(@Param('id') id: number): Promise<void> {
        await this.bookService.index(id);
    }

    protected async fileResponse(file: [Stream, string], response: Response): Promise<void> {
        response.setHeader('content-type', 'application/octet-stream');
        response.setHeader('Content-Disposition', `attachment; filename="${file[1]}"`);
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