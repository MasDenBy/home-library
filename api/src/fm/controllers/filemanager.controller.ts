import { controller, httpGet, queryParam } from "inversify-express-utils";
import { ApiController } from "../../common/controllers/api.controller";
import { FileManagerService } from "../services/filemanager.service";

@controller("/fm")
export class FileManagerController extends ApiController {

    constructor(private fileManagerService: FileManagerService) {
        super()
    }

    @httpGet('/')
    public async list(@queryParam('path') path: string) {
        const result = await this.fileManagerService.directoryList(path);

        return this.json(result);
    }
}