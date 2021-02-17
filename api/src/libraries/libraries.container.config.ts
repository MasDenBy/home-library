import { Container } from "inversify";
import { LibraryDataObject } from "./dataaccess/library.dataobject";
import { LibraryService } from "./services/library.service";
import { LibraryWatcher } from "./services/library.watcher";

export class LibrariesContainerConfig {
    static configure(container: Container): void {
        container.bind<LibraryService>(LibraryService).toSelf();
        container.bind<LibraryDataObject>(LibraryDataObject).toSelf();
        container.bind<LibraryWatcher>(LibraryWatcher).toSelf();
    }
}