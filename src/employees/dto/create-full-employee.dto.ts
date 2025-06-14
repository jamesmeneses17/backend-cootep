import { IsString, IsEmail, IsDateString, IsNumber } from 'class-validator';

export class CreateFullEmployeeDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  national_id: string;

  @IsDateString()
  birth_date: string;

  @IsEmail()
  email: string;

  @IsNumber()
  statusId: number;

  @IsNumber()
  roleId: number;
}
