import { Container } from "inversify";
import { DatabaseWrapper } from "./dataaccess/db.wrapper";
import { FileSystemWrapper } from "./services/fs.wrapper";
import { ImageService } from "./services/image.service";
import { IndexerService } from "./services/indexer.service";
import { OpenLibraryService } from "./services/openlibrary";

export class CommonContainerConfig {
    static configure(container: Container): void {
        // dataaccess
        container.bind<DatabaseWrapper>(DatabaseWrapper).toSelf();

        // services
        container.bind<FileSystemWrapper>(FileSystemWrapper).toSelf();
        container.bind<ImageService>(ImageService).toSelf();
        container.bind<IndexerService>(IndexerService).toSelf();
        container.bind<OpenLibraryService>(OpenLibraryService).toSelf();
    }
}