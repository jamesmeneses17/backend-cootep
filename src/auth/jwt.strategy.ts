import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

    async validate(payload: any) {
        // Retorna un objeto con la informacion del usuario
        return { userId: payload.sub, role: payload.role };
    }
}


