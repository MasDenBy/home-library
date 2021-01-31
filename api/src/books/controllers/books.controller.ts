import express from 'express';
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";

import { BooksService } from '../services/books.service';

import debug from 'debug';

const log: debug.IDebugger = debug('app:books-controller');

@controller("/books")
export class BooksController implements interfaces.Controller {

    constructor(private booksService: BooksService) { }

    @httpGet('/')
    public async listBooks(req: express.Request, res: express.Response) {
        log('listBooks');
        log(this.booksService);
        const books = await this.booksService.list(100, 0);
        res.status(200).send(books);
    }

    @httpGet('/:id')
    public async getBookById(@requestParam('id') id: string, res: express.Response) {
        const book = await this.booksService.readById(id);
        res.status(200).send(book);
    }

    @httpPost('/')
    public async createBook(req: express.Request, res: express.Response) {
        const bookId = await this.booksService.create(req.body);
        res.status(201).send({id: bookId});
    }

    @httpPut('/:id')
    public async put(@requestParam('id') id: string, req: express.Request, res: express.Response) {
        log(await this.booksService.updateById({id: id, ...req.body}));
        res.status(204).send(``);
    }

    @httpDelete('/:id')
    public async removeBook(@requestParam('id') id: string, res: express.Response) {
        log(await this.booksService.deleteById(id));
        res.status(204).send(``);
    }
}