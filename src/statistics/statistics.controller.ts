import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  // 1. Total de empleados activos
  @Get('active-employees')
  getActiveEmployees() {
    return this.statisticsService.countActiveEmployees();
  }

  // 2. Tipos de contrato más usados
  @Get('contract-types')
  getContractTypeStats() {
    return this.statisticsService.contractTypeUsage();
  }

  // 3. Frecuencia de inicio de sesión
  @Get('login-frequency')
  getLoginFrequency() {
    return this.statisticsService.loginStats();
  }

  // 4. Distribución de empleados por estado
  @Get('employee-status')
  getEmployeeStatusDistribution() {
    return this.statisticsService.employeeStatusDistribution();
  }

  // 5. Cargos con más empleados
  @Get('employees-by-position')
  getEmployeesByPosition() {
    return this.statisticsService.countEmployeesByPosition();
  }
  // 6. Empleados con múltiples contratos
  @Get('employees-multiple-contracts')
  getEmployeesWithMultipleContracts() {
    return this.statisticsService.countEmployeesWithMultipleContracts();
  }

  // 7. Cantidad de HISTORIAL LABORAL por empleado
  @Get('employment-history-count')
  getEmploymentHistoryCount() {
    return this.statisticsService.countEmploymentHistory();
  }

  @Get('top-multiple-contracts')
  getTopMultipleContracts() {
    return this.statisticsService.topEmployeesWithMultipleContracts();
  }
}
