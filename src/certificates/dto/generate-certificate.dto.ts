// src/certificates/dto/generate-certificate.dto.ts
import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateCertificateDto {
  @ApiProperty({ enum: ['salario', 'funciones', 'historial'] })
  @IsIn(['salario', 'funciones', 'historial'])
  type: 'salario' | 'funciones' | 'historial';
}
