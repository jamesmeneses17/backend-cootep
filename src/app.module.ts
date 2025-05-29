import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      //envFilePath: `.env.${process.env.NODE_ENV}`, // utilizando las variables de entorno
      isGlobal: true, // para que las variables de entorno sean accesibles en toda la aplicación
    }
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], 

      }),
      inject: [ConfigService],

    }),
    AuthModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
