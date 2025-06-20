import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Decorador que indica que esta clase es un guardia de autenticacion
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
