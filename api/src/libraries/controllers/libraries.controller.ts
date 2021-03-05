import express from 'express';
import { controller, httpGet, httpPost, httpDelete, requestParam, HttpResponseMessage } from "inversify-express-utils";

import { LibraryService } from '../services/library.service';
import { ApiController } from '../../common/controllers/api.controller';
import { CreatedNegotiatedContentResult, JsonResult, OkResult } from 'inversify-express-utils/dts/results';

@controller("/libraries")
export class LibrariesController extends ApiController {

    constructor(private libraryService: LibraryService) {
        super();
     }

    @httpGet('/')
    public async list(): Promise<JsonResult> {
        const libraries = await this.libraryService.list();

        return this.json(libraries);
    }

    @httpGet('/:id')
    public async getById(@requestParam('id') id: number): Promise<JsonResult> {
        const library = await this.libraryService.getById(id);

        return this.json(library);
    }

    @httpPost('/')
    public async create(request: express.Request): Promise<CreatedNegotiatedContentResult<number>> {
        const id = await this.libraryService.save(request.body);

        return this.created('/libraries', id);
    }

    @httpDelete('/:id')
    public async delete(@requestParam('id') id: number): Promise<HttpResponseMessage> {
        await this.libraryService.deleteById(id);

        return this.noContent();
    }

    @httpGet('/:id/index')
    public async index(@requestParam('id') id: number): Promise<OkResult> {
        await this.libraryService.index(id);

        return this.ok();
    }
}