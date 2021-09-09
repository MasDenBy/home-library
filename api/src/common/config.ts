import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class Config {
    constructor(private configService: ConfigService) {}

    public get port() {
        return this.configService.get<number>("PORT");
    }
}