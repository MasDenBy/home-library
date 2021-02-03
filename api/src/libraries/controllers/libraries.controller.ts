import express from 'express';
import debug from 'debug';
import { controller, httpGet, httpPost, httpDelete, requestParam } from "inversify-express-utils";

import { LibraryService } from '../services/library.service';
import { ApiController } from '../../common';

const log: debug.IDebugger = debug('app:libraries-controller');

@controller("/libraries")
export class LibrariesController extends ApiController {

    constructor(private libraryService: LibraryService) {
        super();
     }

    @httpGet('/')
    public async list() {
        const libraries = await this.libraryService.list();

        return this.json(libraries);
    }

    @httpGet('/:id')
    public async getById(@requestParam('id') id: number) {
        const library = await this.libraryService.getById(id);
        
        return this.json(library);
    }

    @httpPost('/')
    public async create(request: express.Request) {
        const id = await this.libraryService.save(request.body);

        return this.created('/libraries', {id: id});
    }

    @httpDelete('/:id')
    public async delete(@requestParam('id') id: number) {
        await this.libraryService.deleteById(id);
        
        return this.noContent();
    }
}