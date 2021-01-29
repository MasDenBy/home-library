import "reflect-metadata";
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';

import './books/controllers/books.controller';
import './libraries/controllers/libraries.controller';

import { container } from './inversify.config';
import { Config } from './config';

const debugLog: debug.IDebugger = debug('app');

let server = new InversifyExpressServer(container);
server.setConfig(app => {
    app.use(bodyparser.json());
    app.use(cors());
    app.use(expressWinston.logger({
        transports: [
            new winston.transports.Console()
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        )
    }));
    app.get('/', (req: express.Request, res: express.Response) => {
        res.status(200).send(`Server up and running!`)
    });
});

let app = server.build();
app.listen(new Config().port);