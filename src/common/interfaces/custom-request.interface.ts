// src/common/interfaces/custom-request.interface.ts
import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    sub: number; // ID del usuario
    role: string; // Rol (admin o empleado)
    email: string; // Correo
    employeeId: number; // ID del empleado, viene en el token
  };
}
