import { Container } from "inversify";
import { BooksContainerConfig } from "./books/books.container.config";

const container = new Container();
BooksContainerConfig.configure(container);

export { container };