import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

function initSwagger(app: INestApplication): void {
  const apiDocument = new DocumentBuilder()
    .setTitle('Home Library')
    .setDescription('The Home Library API description')
    .setVersion('1.0')
    .addTag('home library')
    .build();

  const document = SwaggerModule.createDocument(app, apiDocument);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  initSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port);
}
bootstrap();
