import express from 'express';
import debug from 'debug';
import { interfaces, controller, httpGet, httpPost, httpDelete, response, requestParam } from "inversify-express-utils";

import { LibraryService } from '../services/library.service';

const log: debug.IDebugger = debug('app:libraries-controller');

@controller("/libraries")
export class LibrariesController implements interfaces.Controller {

    constructor(private libraryService: LibraryService) { }

    @httpGet('/')
    public async list(req: express.Request, res: express.Response) {
        const libraries = await this.libraryService.list();
        res.status(200).send(libraries);
    }

    @httpGet('/:id')
    public async getById(@requestParam('id') id: number, @response() res: express.Response) {
        const library = await this.libraryService.getById(id);
        res.status(200).send(library);
    }

    @httpPost('/')
    public async create(req: express.Request, res: express.Response) {
        const id = await this.libraryService.save(req.body);
        res.status(201).send({id: id});
    }

    @httpDelete('/:id')
    public async delete(@requestParam('id') id: number, @response() res: express.Response) {
        await this.libraryService.deleteById(id);
        res.status(204).send(``);
    }
}