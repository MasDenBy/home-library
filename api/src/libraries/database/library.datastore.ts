import { Injectable } from "@nestjs/common";
import { Connection } from "typeorm";

import { BaseDataStore } from "../../common/database/base.datastore";
import { Library } from "./library.entity";

@Injectable()
export class LibraryDataStore extends BaseDataStore<Library> {
    constructor(connection: Connection) {
        super(connection, Library)
    }
}