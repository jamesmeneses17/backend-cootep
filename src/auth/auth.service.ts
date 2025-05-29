import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: [
        { email: identifier },
        { cedula: identifier },
      ],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
    };


  }


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
      mensaje: 'Usuario creado correctamente',
      user: {
        id: guardado.id,
        email: guardado.email,
        role: guardado.role,
      },
    };
  }


}
