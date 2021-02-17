import { Container } from "inversify";
import { FileManagerService } from "./services/filemanager.service";

export class FileManagerContainerConfig {
    static configure(container: Container): void {
        container.bind<FileManagerService>(FileManagerService).toSelf();
    }
}