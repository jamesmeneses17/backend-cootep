import { IsString, MinLength } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  @MinLength(5)
  name: string;
}
