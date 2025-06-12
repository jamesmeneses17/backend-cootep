// Interface de user para el JWT
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  employeeId?: number;
}

// Estructura-molde  para restrear intentos fallidos de login
export interface FailedLogin {
  attempts: number;
  blockUntil?: number;
}

// Estructura del payload del token de refresco
export interface RefreshTokenPayload {
  sub: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
