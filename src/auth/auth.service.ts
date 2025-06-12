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
import {
  FailedLogin,
  JwtPayload,
} from '../common/interfaces/jwt-payload.interface';
import { MailService } from '../common/mail/mail.services';
import { FirstLoginChangePasswordDto } from './dto/first-login-change-password.dto';
import { access } from 'fs';
import { validatePasswordStrength } from '../common/utils/password-validator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Employee } from '../employees/entities/employee.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  // Mapa en memoria para almacenar intentos fallidos por identificador
  private failedAttempts = new Map<string, FailedLogin>();

  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly mailService: MailService,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  // Método principal para manejar el login
  async login({ email, password }: LoginDto) {
    this.throwifBlocked(email);
    console.log('Identificador recibido:', email);

    // Busca el usuario únicamente por email
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'employee'],
    });

    console.log('usuario encontrado:', user);

    // Comparación directa si estás usando contraseñas sin encriptar
    const passwordValid = user && password === user.password;

    console.log('Contraseña valida?', passwordValid);

    if (!passwordValid) {
      this.trackFailedAttempt(email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.isTempPassword) {
      console.log('Constraseña temporal detectada');
      return {
        message: 'Debe cambiar su contraseña temporal antes de continuar',
        forcePasswordChange: true,
        userId: user.id,
      };
    }

    // Elimina el historial de intentos fallidos
    this.clearFailedAttempts(email);

    //  Generar access token
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        role: user.role.name, // ← aquí está el cambio correcto
        email: user.email, // ← opcional pero recomendado
        employeeId: user.employee?.id ?? null, // 👈 añade esto
      },
      { expiresIn: '1h' },
    );

    // Generar refresh token
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      },
    );

    // Guardar refresh token en la base de datos
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    console.log('Tokens generados exitosamente');

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // Crea un usuario de prueba con contraseña encriptada
  /*async CrearUsuarioTest() {
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
*/
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

  //Metodo del refresh token
  // Recibe el refresh que el front le envía
  // Verifica con la clave secreta del refresh token
  // Genera un nuevo access token
  async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken } = dto;

    // Valida que el que el token no sea nulo usando la llave clave secreta
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      }) as JwtPayload;

      //Buscar el usuario por el id del payload
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no valido');
      }

      const newAccesToken = this.jwtService.sign(
        { sub: user.id, role: user.role },
        { expiresIn: '1h' },
      );

      return {
        access_token: newAccesToken,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Token de actualización inválido o expirado',
      );
    }
  }

  // Metodo cargar el perfil del usuario que se logue
  async getProfile(userId: number) {
    // 1. Consultar el usuario con role y empleado (sin historial)
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'employee'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // 2. Si existe empleado, obtenerlo junto con su historial laboral
    if (user.employee) {
      const employeeWithHistory = await this.employeeRepository.findOne({
        where: { id: user.employee.id },
        relations: ['historial'], // <-- Carga el historial laboral
      });
    }

    // 3. Construir el perfil con historial
    return {
      id: user.id,
      email: user.email,
      cedula: user.cedula,
      role: user.role.name,
      employee: user.employee
        ? {
            nombres: user.employee.first_name,
            apellidos: user.employee.last_name,
            cedula: user.employee.national_id,
          }
        : null,
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new Error('Usuario no encontrado');

    console.log('Password enviada:', dto.currentPassword);
    console.log('Password en base de datos:', user.password);

    if (dto.currentPassword.trim() !== user.password.trim()) {
      throw new Error('La contraseña actual es incorrecta');
    }

    user.password = dto.newPassword;

    await this.userRepository.save(user);

    return { message: 'Contraseña cambiada con éxito' };
  }
}
