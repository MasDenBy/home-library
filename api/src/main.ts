import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from './core/config/config';

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

  await app.listen(config.port);
}
bootstrap();
