import { Container } from "inversify";
import { DatabaseWrapper } from "./dataaccess/db.wrapper";

export class CommonContainerConfig {
    static configure(container: Container): void {
        container.bind<DatabaseWrapper>(DatabaseWrapper).toSelf();
    }
}