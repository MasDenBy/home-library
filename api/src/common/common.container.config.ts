import { Container } from "inversify";
import { DatabaseWrapper } from "./dataaccess/db.wrapper";
import { FileSystemWrapper } from "./services/fs.wrapper";
import { IndexerService } from "./services/indexer.service";

export class CommonContainerConfig {
    static configure(container: Container): void {
        // dataaccess
        container.bind<DatabaseWrapper>(DatabaseWrapper).toSelf();

        // services
        container.bind<FileSystemWrapper>(FileSystemWrapper).toSelf();
        container.bind<IndexerService>(IndexerService).toSelf();
    }
}