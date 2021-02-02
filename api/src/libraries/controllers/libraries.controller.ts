import express from 'express';
import debug from 'debug';
import { interfaces, controller, httpGet, httpPost, httpDelete, response, requestParam } from "inversify-express-utils";

import { LibraryService } from '../services/library.service';

const log: debug.IDebugger = debug('app:libraries-controller');

@controller("/libraries")
export class LibrariesController implements interfaces.Controller {

    constructor(private libraryService: LibraryService) { }

    @httpGet('/')
    public async list(request: express.Request, response: express.Response) {
        const libraries = await this.libraryService.list();
        response.status(200).send(libraries);
    }

    @httpGet('/:id')
    public async getById(@requestParam('id') id: number, @response() response: express.Response) {
        const library = await this.libraryService.getById(id);
        response.status(200).send(library);
    }

    @httpPost('/')
    public async create(request: express.Request, response: express.Response) {
        const id = await this.libraryService.save(request.body);
        response.status(201).send({id: id});
    }

    @httpDelete('/:id')
    public async delete(@requestParam('id') id: number, @response() response: express.Response) {
        await this.libraryService.deleteById(id);
        response.status(204).send();
    }
}