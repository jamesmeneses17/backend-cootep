import { Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
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
import { BadRequestException } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../common/mail.services';

// Estructura-molde  para restrear intentos fallidos de login
interface FailedLogin {
  attempts: number;
  blockUntil?: number;
}

@Injectable()
export class AuthService {
  //Mapa en memoria para almacenr
  private failedAttempts = new Map<string, FailedLogin>();

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService, // servicio de correo configurado
  ) { }

  // Metodo principial para manejar el login
  async login({ identifier, password }: LoginDto) {
    this.throwifBlocked(identifier);

    //Busca el usuario por email o cedula
    const user = await this.userRepository.findOne({
      where: [
        { email: identifier },
        { cedula: identifier },
      ],
    });


    // Verifica si user existe y si la contra es correcta
    const passwordValid = user && await bcrypt.compare(password, user.password);
    // Si no es valida , se registra el intento fallido
    if (!passwordValid) {
      this.trackFailedAttempt(identifier);
      throw new UnauthorizedException('Credenciales invalidas');
    }
    // si es valid , clear into failed anterior
    this.clearFailedAttempts(identifier);
    // Devuelve el JWT firmado
    return {
      access_token: this.jwtService.sign(
        { sub: user.id, role: user.role },
        { expiresIn: '1h' }
      ),
    };
  }


  // Endpoint para crear un usuario de prueba
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

  // Expecion si el usuario tiene bloqueado el login

  private throwifBlocked(identifier: string) {
    const entry = this.failedAttempts.get(identifier);
    if (entry?.blockUntil && Date.now() < entry.blockUntil) {
      throw new TooManyRequestsException('Demasiados intentos fallidos. Intente de nuevo 5 minutos.');
    }
  }

  // Incrementa el contador de intentos fallidos
  private trackFailedAttempt(identifier: string) {
    const entry = this.failedAttempts.get(identifier) || { attempts: 0 };
    entry.attempts += 1;
    if (entry.attempts >= 5) {
      entry.blockUntil = Date.now() + 5 * 60 * 1000;
    }
    this.failedAttempts.set(identifier, entry);

  }
  //Elimina los intentos fallidos
  private clearFailedAttempts(identifier: string) {
    this.failedAttempts.delete(identifier);
  }

  // Recuperacion de contraseña
async sendPasswordResetToken(dto: ForgotPasswordDto) {
    const { identifier } = dto;

    //Busca el user por email o cedula
    const user = await this.userRepository.findOne({
      where: [
        { email: identifier },
        { cedula: identifier },
      ],
    });

    if (!user) throw new NotFoundException('usuario no encontrado');


    //Generacion del token de recuperacion
    const token = uuidv4();
    const expires = dayjs().add(15, 'minute').toDate(); // expira en 15 minutos

    //Guarda del token en la bd y fecha de ex
    user.resetToken = token;
    user.resetTokenExpires = expires;
    await this.userRepository.save(user);

    // Todo: enviar correo con el link (usa tu servicio de email)
    await this.mailService.send({
      to: user.email,
      subject: 'Recuperación de contraseña',
      html: `
      <p>Has solicitado recuperar tu contraseña.</p>
      <p><a href="http://tu-app.com/reset-password?token=${token}">Haz clic aquí para restablecerla</a></p>
      <p>Este enlace expira en 15 minutos.</p>
    `,
    });

    // Respuesta al cliente
    return {
      message: 'Se ha enviado el enlace de recuperacion al correo registrado'
    };
  }

  //Reseteo de contraseña
  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword } = dto;

    const user = await this.userRepository.findOne({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new NotFoundException('Token invalido o expirado');
    }

    const hashedPasword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPasword;
    user.resetToken = null; // Limpiar el token
    user.resetTokenExpires = null; // Limpiar la fecha de expiración

    await this.userRepository.save(user);

    return {
      message: 'Contraseña actualizada exitosamente',
    }
  }

}