import { Container } from "inversify";
import { BookDataObject } from "./dataaccess/book.dataobject";
import { BookService } from "./services/book.service";

export class BooksContainerConfig {
    static configure(container: Container): void {
        container.bind<BookDataObject>(BookDataObject).toSelf();
        container.bind<BookService>(BookService).toSelf();
    }
}