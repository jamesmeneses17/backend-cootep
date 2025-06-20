import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateEmploymentHistoryDto {
    @IsNumber()
    employeeId: number;

    @IsNumber()
    positionId: number;

    @IsNumber()
    contractTypeId: number;

    @IsNumber()
    salary: number;

    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}
