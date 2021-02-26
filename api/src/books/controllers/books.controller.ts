import express, { Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { controller, httpGet, httpPost, httpDelete, requestParam, httpPut, queryParam, HttpResponseMessage, response } from "inversify-express-utils";

import { BookService } from '../services/book.service';
import { ApiController } from '../../common/controllers/api.controller';
import { BookDto } from '../dto/book.dto';
import { JsonResult, OkResult } from 'inversify-express-utils/dts/results';

@controller("/books")
export class BooksController extends ApiController {

    constructor(private bookService: BookService) {
        super()
    }

    @httpGet('/')
    public async list(@queryParam('offset') offset: number, @queryParam('count') count: number): Promise<JsonResult> {
        const page = await this.bookService.list(offset, count);
        
        return this.json(page);
    }

    @httpPost('/search')
    public async search(request: express.Request): Promise<JsonResult> {
        const books = await this.bookService.search(request.body);
        
        return this.json(books);
    }

    @httpGet('/:id')
    public async getBookById(@requestParam('id') id: number): Promise<JsonResult> {
        const book = await this.bookService.getById(id);
        
        return this.json(book);
    }

    @httpPut('/:id')
    public async put(@requestParam('id') id: number, request: express.Request): Promise<HttpResponseMessage> {
        await this.bookService.update(id, <BookDto>{id: id, ...request.body});

        return this.noContent();
    }

    @httpDelete('/:id')
    public async removeBook(@requestParam('id') id: number): Promise<HttpResponseMessage> {
        await this.bookService.deleteById(id);

        return this.noContent();
    }

    @httpGet('/:id/file')
    public async getBookFile(@requestParam('id') id: number, @response() response: Response): Promise<void> {
        const file = await this.bookService.getFile(id);
        
        await this.fileResponse(file, response);
    }

    @httpGet('/:id/index')
    public async index(@requestParam('id') id: number): Promise<OkResult> {
        await this.bookService.index(id);

        return this.ok();
    }
}