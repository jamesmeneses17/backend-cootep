import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(private dataSource: DataSource) { }

  // 1. Total de empleados activos
  async countActiveEmployees(): Promise<number> {
    const result = await this.dataSource.query(`
      SELECT COUNT(*) AS total
      FROM employees e
      INNER JOIN status s ON s.id = e.statusId
      WHERE s.name = 'Activo'
    `);
    return result[0]?.total || 0;
  }

  // 2. Tipos de contrato más utilizados
  async contractTypeUsage(): Promise<{ name: string; count: number }[]> {
    return this.dataSource.query(`
      SELECT ct.name, COUNT(*) AS count
      FROM employment_history eh
      JOIN contract_types ct ON ct.id = eh.contractTypeId
      GROUP BY ct.name
    `);
  }

  // 3. Frecuencia de inicio de sesión
  async loginStats(): Promise<{ date: string; total: number }[]> {
    return this.dataSource.query(`
      SELECT DATE(u.last_login) AS date, COUNT(*) AS total
      FROM users u
      WHERE u.last_login IS NOT NULL
      GROUP BY DATE(u.last_login)
      ORDER BY date DESC
    `);
  }

  // 4. Distribución de empleados por estado
  async employeeStatusDistribution(): Promise<{ status: string; count: number }[]> {
    return this.dataSource.query(`
      SELECT s.name AS status, COUNT(*) AS count
      FROM employees e
      JOIN status s ON s.id = e.statusId
      GROUP BY s.name
    `);
  }
  // 5. Cargos con más empleados
  async countEmployeesByPosition(): Promise<{ cargo: string; cantidad: number }[]> {
    return this.dataSource.query(`
    SELECT p.title AS cargo, COUNT(*) AS cantidad
    FROM employment_history eh
    JOIN positions p ON p.id = eh.positionId
    GROUP BY p.title
    ORDER BY cantidad DESC
  `);
  }

  // 6. Empleados con múltiples contratos
  async countEmployeesWithMultipleContracts(): Promise<number> {
    const result = await this.dataSource.query(`
    SELECT COUNT(*) AS total
    FROM (
      SELECT employee_id
      FROM employment_history
      GROUP BY employee_id
      HAVING COUNT(*) > 1
    ) AS sub;
  `);
    return result[0]?.total || 0;
  }



  // 7. Total de historial laboral
  async countEmploymentHistory(): Promise<number> {
    const result = await this.dataSource.query(`
    SELECT COUNT(*) AS total FROM employment_history
  `);
    return result[0]?.total || 0;
  }

  async topEmployeesWithMultipleContracts(): Promise<{ fullName: string, totalContracts: number }[]> {
  return this.dataSource.query(`
    SELECT 
      CONCAT(e.first_name, ' ', e.last_name) AS fullName,
      COUNT(*) AS totalContracts
    FROM employment_history eh
    JOIN employees e ON e.id = eh.employee_id
    GROUP BY e.id
    HAVING COUNT(*) > 1
    ORDER BY totalContracts DESC
    LIMIT 5
  `);
}


}
