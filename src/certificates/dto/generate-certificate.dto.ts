// src/certificates/dto/generate-certificate.dto.ts
import { IsIn, IsOptional, IsDateString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateCertificateDto {
  @ApiProperty({ enum: ['salario', 'funciones', 'historial'] })
  @IsIn(['salario', 'funciones', 'historial'])
  type: 'salario' | 'funciones' | 'historial';

  @ApiPropertyOptional({
    description: 'Fecha de inicio del filtro (solo para historial)',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin del filtro (solo para historial)',
    example: '2023-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'ID del historial laboral (solo para salario o funciones)',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  historyId?: number;
}
