import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { AppModule } from './app.module';
import configuration from './core/config/configuration';

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

function createLogger(config) {
  const transports: winston.transport[] = [
    new winston.transports.File({
      filename: config.logging.filename,
      level: config.logging.level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ];

  if (process.env.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('api', {
            prettyPrint: true,
          }),
        ),
      }),
    );
  }

  return WinstonModule.createLogger({
    transports: transports,
  });
}

async function bootstrap() {
  const config = configuration();

  const app = await NestFactory.create(AppModule, {
    logger: createLogger(config),
  });
  app.enableCors();

  initSwagger(app);

  await app.listen(config.port);
}
bootstrap();
