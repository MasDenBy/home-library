import "reflect-metadata";
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';

import './books/controllers/books.controller';
import './fm/controllers/filemanager.controller';
import './libraries/controllers/libraries.controller';

import { Config } from './config';
import { Container } from "inversify";

const debugLog: debug.IDebugger = debug('app');

export class App {
    private server: InversifyExpressServer;

    constructor(private container: Container) {
        this.server = new InversifyExpressServer(container);
        this.server.setConfig(app => {
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
    }
    
    public run(): express.Application {
        let app = this.server.build();
        app.listen(this.container.resolve(Config).port);

        return app;
    }
}