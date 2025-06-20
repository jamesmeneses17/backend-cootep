import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:4200',
    Credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API CootepCertificados')
    .setDescription('Documentacion del sistema')
    .setVersion('1.0')
    .addBearerAuth() // habilitacion del token de seguridad
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //  Obtener e invocar AuthService
  /*const authService = app.get(AuthService);
  await authService.corregirPasswordAdmin();*/

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
