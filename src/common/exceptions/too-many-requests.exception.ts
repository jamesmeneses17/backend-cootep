import { HttpException, HttpStatus } from '@nestjs/common';

//user realiza demasiados intentos de login , el sistea le bloquea el acceso por un tiempo determinado
export class TooManyRequestsException extends HttpException {
  constructor(message = 'Demasiados intentos.Intenta de nuevo en 5 minutos') {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
