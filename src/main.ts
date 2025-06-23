// eslint-disable-next-line @typescript-eslint/no-require-imports
import basicAuth = require('express-basic-auth');
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import * as express from 'express';
import { swaggerUsers } from './constants/swagger_credentials.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  app.use(bodyParser.urlencoded({ extended: true }));

  const configService = app.get(ConfigService);
  const swaggerCredentials = await swaggerUsers();
  const swaggerUser = swaggerCredentials.swaggerUser;
  const swaggerPassword = swaggerCredentials.swaggerPassword;

  if (swaggerUser && swaggerPassword) {
    app.use(
      ['/docs', '/docs-json'],
      basicAuth({
        users: { [swaggerUser]: swaggerPassword },
        challenge: true,
        realm: 'Swagger',
      }),
    );
  }

  const config = new DocumentBuilder()
    .setTitle('COOTEP API')
    .setDescription('API for managing the web app from "COOTEP"')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

 
  const origin = configService.get<string>('APP_CORS_ORIGIN');
  const allowedHeaders = configService.get<string>('APP_CORS_ALLOWED_HEADERS')?.split(',') || ['Content-Type', 'Authorization'];
  const allowedMethods = configService.get<string>('APP_CORS_ALLOWED_METHODS')?.split(',') || ['GET', 'POST'];

  app.enableCors({
    origin,
    credentials: true,
    methods: allowedMethods,
    allowedHeaders: allowedHeaders,
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(
    '/docs',
    express.static(join(__dirname, '../node_modules/swagger-ui-dist')),
  );

  await app.listen(configService.get<number>('APP_PORT') || 3000);
}
bootstrap();
