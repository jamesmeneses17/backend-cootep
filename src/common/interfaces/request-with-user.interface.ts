// Objeto user, interfaz para acceder a datos del usuario autenticado
export interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
    role: string;
  };
}
