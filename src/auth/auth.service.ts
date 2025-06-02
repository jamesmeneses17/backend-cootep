import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TooManyRequestsException } from '../common/exceptions/too-many-requests.exception';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FailedLogin } from '../common/interfaces/jwt-payload.interface';
import { MailService } from '../common/mail/mail.services';
import { FirstLoginChangePasswordDto } from './dto/first-login-change-password.dto';
import { access } from 'fs';
import { validatePasswordStrength } from '../common/utils/password-validator';

@Injectable()
export class AuthService {
  // Mapa en memoria para almacenar intentos fallidos por identificador
  private failedAttempts = new Map<string, FailedLogin>();

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  // Método principal para manejar el login
  async login({ identifier, password }: LoginDto) {
    this.throwifBlocked(identifier);

    //identificador recibido
    console.log('Identificador recibido:', identifier);

    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { cedula: identifier }],
    });

    //Log del usuario encontrado
    console.log('usuario encontrado:', user);

    const passwordValid =
      user && (await bcrypt.compare(password, user.password));

    console.log('Contraseña valida?', passwordValid);

    if (!passwordValid) {
      this.trackFailedAttempt(identifier);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Ingresar una nueva contraseña si es temporal
    if (user.isTempPassword) {
      console.log('Constraseña temporal detectada');
      return {
        message: 'Debe cambiar su contraseña temporal antes de continuar',
        forcePasswordChange: true,
        userId: user.id,
      };
    }

    this.clearFailedAttempts(identifier);

    const token = this.jwtService.sign(
      { sub: user.id, role: user.role },
      { expiresIn: '1h' },
    );

    console.log('Token generado exitosamente', token);

    return {
      access_token: token,
    };
  }

  // Crea un usuario de prueba con contraseña encriptada
  async CrearUsuarioTest() {
    const hashedPassword = await bcrypt.hash('123456', 10);

    const nuevoUsuario = this.userRepository.create({
      email: 'admin@cotep.com',
      cedula: '123456',
      password: hashedPassword,
      role: { id: 1 },
      employee: { id: 1 },
    });

    const guardado = await this.userRepository.save(nuevoUsuario);

    return {
      mensaje: 'Usuario creado exitosamente',
      user: {
        id: guardado.id,
        email: guardado.email,
        Role: guardado.role,
      },
    };
  }

  // Lanza excepción si el usuario está temporalmente bloqueado
  private throwifBlocked(identifier: string) {
    const entry = this.failedAttempts.get(identifier);
    if (entry?.blockUntil && Date.now() < entry.blockUntil) {
      throw new TooManyRequestsException(
        'Demasiados intentos fallidos. Intente de nuevo en 5 minutos.',
      );
    }
  }

  // Registra intentos fallidos y bloquea tras 5 intentos
  private trackFailedAttempt(identifier: string) {
    const entry = this.failedAttempts.get(identifier) || { attempts: 0 };
    entry.attempts += 1;
    if (entry.attempts >= 5) {
      entry.blockUntil = Date.now() + 5 * 60 * 1000; // 5 minutos
    }
    this.failedAttempts.set(identifier, entry);
  }

  // Elimina los intentos fallidos al hacer login exitoso
  private clearFailedAttempts(identifier: string) {
    this.failedAttempts.delete(identifier);
  }

  // Genera token de recuperación y envía el correo
  async sendPasswordResetToken(dto: ForgotPasswordDto) {
    const { identifier } = dto;

    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { cedula: identifier }],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const token = uuidv4();
    const expires = dayjs().add(15, 'minute').toDate();

    user.resetToken = token;
    user.resetTokenExpires = expires;
    await this.userRepository.save(user);

    // Enviar correo con el enlace de recuperación
    await this.mailService.sendPasswordResetLink(user.email, token);

    return {
      message: 'Se ha enviado el enlace de recuperación al correo registrado',
    };
  }

  // Verifica token y guarda nueva contraseña
  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;

    // Validar la fortaleza de la nueva contraseña que cumpla con los requisitos
    const validationError = validatePasswordStrength(newPassword);
    if (validationError) {
      throw new BadRequestException(validationError);
    }

    const user = await this.userRepository.findOne({
      where: { resetToken: token },
    });

    if (
      !user ||
      !user.resetTokenExpires ||
      user.resetTokenExpires < new Date()
    ) {
      throw new NotFoundException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;

    await this.userRepository.save(user);
    await this.mailService.sendPasswordChangedConfirmation(user.email);

    return {
      message: 'Contraseña actualizada exitosamente',
      //Genera un nuevo token de acceso tras el cambio de contraseña
      access_token: this.jwtService.sign(
        { sub: user.id, role: user.role },
        { expiresIn: '1h' },
      ),
    };
  }

  // Cambiar la contraseña temporal en el primer inicio de sesión
  async changeTempPassword(dto: FirstLoginChangePasswordDto) {
    // Validar que la nueva contraseña cumpla con los requisitos de fortaleza
    const validationError = validatePasswordStrength(dto.newPassword);
    if (validationError) {
      throw new BadRequestException(validationError);
    }

    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.isTempPassword) {
      throw new BadRequestException('La contraseña ya ha sido cambiada');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.isTempPassword = false;
    await this.userRepository.save(user);

    return {
      message: 'Contraseña actualizada exitosamente. Ya puede iniciar sesion',
    };
  }
}
