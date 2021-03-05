import "reflect-metadata";
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';

import './books/controllers/books.controller';
import './fm/controllers/filemanager.controller';
import './libraries/controllers/libraries.controller';

import { Config } from './config';
import { Container } from "inversify";
import { LibraryService } from "./libraries/services/library.service";
import { LibraryWatcher } from "./libraries/services/library.watcher";

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
        const app = this.server.build();
        app.listen(this.container.resolve(Config).port);

        return app;
    }

    public async watchLibraries(): Promise<void> {
        const libraries = await this.container.resolve(LibraryService).list();
        const watcher = this.container.resolve(LibraryWatcher);

        libraries.forEach(lib => watcher.run(lib));
    }
}