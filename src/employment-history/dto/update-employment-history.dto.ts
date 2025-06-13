import { IsNumber, IsOptional } from 'class-validator';

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
}
