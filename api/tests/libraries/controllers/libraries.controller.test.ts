import { app } from '../../../src/app';
import supertest from "supertest";

import { LibrariesController } from '../../../src/libraries/controllers/libraries.controller';
import { LibraryService } from '../../../src/libraries/services/library.service';
import { Config } from '../../../src/config';
import { injectable } from 'inversify';
import { container } from '../../../src/inversify.config';
import debug, { log } from 'debug';

const debugLog: debug.IDebugger = debug('test');

describe('/libraries', () => {

    beforeEach(()=> {

    });

    it('/', async () => {
        const result = await supertest(app).get('/');

        expect(result.status).toBe(200);
    });
});