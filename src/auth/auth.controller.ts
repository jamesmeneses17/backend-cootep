import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { FirstLoginChangePasswordDto } from './dto/first-login-change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    console.log('Body recibido:', loginDto);
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request & { user: JwtPayload }) {
    return req.user;
  }

  /* getProfile(@Req() req: Request & { user: JwtPayload }) {
     return this.authService.getProfile(req.user.sub);
   }
 */
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendPasswordResetToken(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('first-login-change-password')
  async changeTempPassword(@Body() dto: FirstLoginChangePasswordDto) {
    return this.authService.changeTempPassword(dto);
  }

  @Post('refresh-token')
  refresAccessToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Req() req: RequestWithUser, @Body() dto: ChangePasswordDto) {
    const userId = req.user.sub; // ya no dará error
    return this.authService.changePassword(userId, dto);
  }
}
