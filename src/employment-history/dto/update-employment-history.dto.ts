import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class UpdateEmploymentHistoryDto {
  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsNumber()
  positionId?: number;

  @IsOptional()
  @IsNumber()
  contractTypeId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}
