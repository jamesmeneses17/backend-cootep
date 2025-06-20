import { IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @MinLength(5)
    name: string;
}
