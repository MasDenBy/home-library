import express from 'express';
import { controller, httpGet, httpPost, httpDelete, requestParam, httpPut } from "inversify-express-utils";

import { BookService } from '../services/book.service';

import debug from 'debug';
import { ApiController } from '../../common/controllers/api.controller';
import { BookDto } from '../dto/book.dto';

const log: debug.IDebugger = debug('app:books-controller');

@controller("/books")
export class BooksController extends ApiController {

    constructor(private bookService: BookService) {
        super()
    }

    @httpGet('/:offset/:count')
    public async list(@requestParam('offset') offset: number, @requestParam('count') count: number) {
        const books = await this.bookService.list(offset, count);
        
        return this.json(books);
    }

    @httpPost('/search')
    public async search(request: express.Request) {
        const books = await this.bookService.search(request.body);
        
        return this.json(books);
    }

    @httpGet('/:id')
    public async getBookById(@requestParam('id') id: number) {
        const book = await this.bookService.getById(id);
        
        return this.json(book);
    }

    @httpPut('/:id')
    public async put(@requestParam('id') id: number, request: express.Request) {
        await this.bookService.update(<BookDto>{id: id, ...request.body});

        return this.noContent();
    }

    @httpDelete('/:id')
    public async removeBook(@requestParam('id') id: number) {
        await this.bookService.deleteById(id);

        return this.noContent();
    }
}