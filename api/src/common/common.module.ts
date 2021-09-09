import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Config } from "./config";


@Module({
    imports: [
        ConfigModule.forRoot()
    ],
    providers: [Config]
})
export class CommonModule {}