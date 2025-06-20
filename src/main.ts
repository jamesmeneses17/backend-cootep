import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as express from 'express';
import basicAuth = require('express-basic-auth');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const swaggerUser = configService.get<string>('SWAGGER_USER') || 'admin';
  const swaggerPassword = configService.get<string>('SWAGGER_PASSWORD') || 'samawe';

  app.use(
    '/docs',
    basicAuth({
      challenge: true,
      users: { [swaggerUser]: swaggerPassword },
    }),
  );

  app.useGlobalInterceptors(

    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  const allowedHeaders = configService.get('app.cors.allowedHeaders');
  const allowedMethods = configService.get('app.cors.allowedMethods');


  const config = new DocumentBuilder()
    .setTitle('API CootepCertificados')
    .setDescription('Documentacion del sistema')
    .setVersion('1.0')
    .addBearerAuth() // habilitacion del token de seguridad
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //  Obtener e invocar AuthService
  /*const authService = app.get(AuthService);
  await authService.corregirPasswordAdmin();*/
  app.enableCors({
    origin: true,
    allowedHeaders,
    methods: allowedMethods,
    credentials: true,
  });

  app.use(
    '/docs',
    express.static(join(__dirname, '../node_modules/swagger-ui-dist')),
  );
  await app.listen(configService.get<number>('APP_PORT') || 3000);
}
bootstrap();


