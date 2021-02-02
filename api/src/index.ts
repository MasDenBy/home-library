
import { App } from './app';
import { container } from './inversify.config';

const app = new App(container).run();
export { app };