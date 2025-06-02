// Interface de user para el JWT
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

// Estructura-molde  para restrear intentos fallidos de login
export interface FailedLogin {
  attempts: number;
  blockUntil?: number;
}
