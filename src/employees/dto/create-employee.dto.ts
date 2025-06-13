import { IsString, IsDateString, IsEmail, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    national_id: string;

    @IsDateString()
    birth_date: Date;

    @IsEmail()
    email: string;

    @IsNumber()
    roleId: number;

    @IsNumber()
    statusId: number;
}
