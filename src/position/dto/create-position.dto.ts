import { IsNotEmpty } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty()
  title: string;

  description?: string;
}
