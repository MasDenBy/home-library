import { BaseHttpController, HttpResponseMessage } from 'inversify-express-utils';
import { Response } from 'express';
import { Stream } from 'stream';

export abstract class ApiController extends BaseHttpController {
    protected noContent(): HttpResponseMessage {
        return new HttpResponseMessage(204);
    }

    protected async fileResponse(file: [Stream, string], response: Response): Promise<void> {
        response.setHeader('content-type', 'application/octet-stream');
        response.setHeader('Content-Disposition', `attachment; filename="${file[1]}"`);
        response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        file[0].pipe(response);

        await this.streamFinished(file[0]);
    }

    private streamFinished(stream: Stream): Promise<void> {
        return new Promise((resolve, reject) => {
            stream.on('end', (v) => resolve(v));
            stream.on('error', () => reject());
        });
    }
}