import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'El token es obligatorio' })
  @IsString({ message: 'El refresh token debe ser una cadena de texto' })
  refreshToken: string;
}
