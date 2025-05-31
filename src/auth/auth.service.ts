import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TooManyRequestsException } from '../common/exceptions/too-many-requests.exception';

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

}