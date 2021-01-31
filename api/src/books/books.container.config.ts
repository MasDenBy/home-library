import { Container } from "inversify";
import { BooksDao } from "./dao/books.dao";
import { BooksService } from "./services/books.service";

export class BooksContainerConfig {
    static configure(container: Container): void {
        container.bind<BooksDao>(BooksDao).toSelf();
        container.bind<BooksService>(BooksService).toSelf();
    }
}