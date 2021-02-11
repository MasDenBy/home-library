import { BaseHttpController, HttpResponseMessage } from "inversify-express-utils";
import fs from 'fs';
import { Response } from "express";

export abstract class ApiController extends BaseHttpController {
    protected noContent() {
        return new HttpResponseMessage(204);
    }

    protected fileResponse(stream: fs.ReadStream, response: Response) {
        response.setHeader('content-type', 'application/octet-stream');
        stream.pipe(response);
    }
}