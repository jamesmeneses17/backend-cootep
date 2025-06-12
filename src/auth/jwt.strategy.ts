import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
//Validacion del token y que se extraera de el
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secreto',
    });
  }

  /*async validate(payload: JwtPayload): Promise<JwtPayload> {
  return payload; // Retorna tal cual*/
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}
