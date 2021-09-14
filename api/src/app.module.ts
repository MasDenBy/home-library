import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { LibrariesModule } from './libraries/libraries.module';

@Module({
  imports: [
    DatabaseModule,
    LibrariesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
