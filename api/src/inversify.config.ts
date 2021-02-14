import { Container } from "inversify";
import { BooksContainerConfig } from "./books/books.container.config";
import { CommonContainerConfig } from "./common/common.container.config";
import { LibrariesContainerConfig } from "./libraries/libraries.container.config";
import { FileManagerContainerConfig } from "./fm/fm.container.config";

import { Config } from "./config";

const container = new Container();
BooksContainerConfig.configure(container);
CommonContainerConfig.configure(container);
FileManagerContainerConfig.configure(container);
LibrariesContainerConfig.configure(container);

container.bind<Config>(Config).toSelf();

export { container };