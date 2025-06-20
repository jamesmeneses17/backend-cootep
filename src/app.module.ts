import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth-guard';
import { EmployeesModule } from './employees/employees.module';
import { ContractTypeModule } from './contract-type/contract-type.module';
import { EmploymentHistoryModule } from './employment-history/employment-history.module';
import { CertificatesModule } from './certificates/certificates.module';
import { FunctionsModule } from './functions/functions.module';
import { StatusModule } from './status/status.module';
import { PositionsModule } from './position/position.module';
import { RolesModule } from './roles/roles.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ImportExcelModule } from './import-excel/import-excel.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      //envFilePath: `.env.${process.env.NODE_ENV}`, // utilizando las variables de entorno
      isGlobal: true, // para que las variables de entorno sean accesibles en toda la aplicación
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/src/*/.entity{.ts,.js}'],
        autoLoadEntities: true,
        ssl: {
          rejectUnauthorized: false,
        },
        // --- INICIO DE LA MODIFICACIÓN ---
        extra: {
          connectionLimit: 10, // Cambiado 'max' por 'connectionLimit'
          // Eliminada la opción 'keepAlive', ya que no es reconocida aquí
        },
        // --- FIN DE LA MODIFICACIÓN ---

        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    EmployeesModule,
    PositionsModule,
    ContractTypeModule,
    EmploymentHistoryModule,
    CertificatesModule,
    FunctionsModule,
    StatusModule,
    RolesModule,
    StatisticsModule,
    ImportExcelModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule { }