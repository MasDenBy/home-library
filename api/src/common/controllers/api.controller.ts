import { BaseHttpController, HttpResponseMessage } from "inversify-express-utils";

export abstract class ApiController extends BaseHttpController {
    protected noContent() {
        return new HttpResponseMessage(204);
    }
}