import express from 'express';
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";

import { BookService } from '../services/book.service';

import debug from 'debug';

const log: debug.IDebugger = debug('app:books-controller');

@controller("/books")
export class BooksController implements interfaces.Controller {

    constructor(private bookService: BookService) { }

    @httpGet('/')
    public async listBooks(req: express.Request, res: express.Response) {
        log('listBooks');
        log(this.bookService);
        const books = await this.bookService.list(100, 0);
        res.status(200).send(books);
    }

    @httpGet('/:id')
    public async getBookById(@requestParam('id') id: string, res: express.Response) {
        const book = await this.bookService.getById(id);
        res.status(200).send(book);
    }

    @httpPost('/')
    public async createBook(req: express.Request, res: express.Response) {
        const bookId = await this.bookService.create(req.body);
        res.status(201).send({id: bookId});
    }

    @httpPut('/:id')
    public async put(@requestParam('id') id: string, req: express.Request, res: express.Response) {
        log(await this.bookService.update({id: id, ...req.body}));
        res.status(204).send(``);
    }

    @httpDelete('/:id')
    public async removeBook(@requestParam('id') id: string, res: express.Response) {
        log(await this.bookService.deleteById(id));
        res.status(204).send(``);
    }
}