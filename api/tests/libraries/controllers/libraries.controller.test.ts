import { app } from '../../../src/app';
import supertest from "supertest";

describe('/libraries', () => {

    beforeEach(()=> {

    });

    test('/', async () => {
        const result = await supertest(app).get('/');

        expect(result.status).toBe(200);
    });
});