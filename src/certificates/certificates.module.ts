import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploymentHistory } from '../employment-history/entities/employment-history.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Certificate } from 'crypto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate, EmploymentHistory, Employee]),
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
