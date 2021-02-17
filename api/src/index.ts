
import { App } from './app';
import { container } from './inversify.config';

const instance = new App(container);
const app = instance.run();

instance.watchLibraries().then();

export { app };