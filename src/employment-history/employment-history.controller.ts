import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { EmploymentHistoryService } from './employment-history.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { CustomRequest } from '../common/interfaces/custom-request.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateEmploymentHistoryDto } from './dto/update-employment-history.dto';
import { CreateEmploymentHistoryDto } from './dto/create-employment-history.dto';

@ApiTags('EmploymentHistory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employment-history')
export class EmploymentHistoryController {
  constructor(private readonly service: EmploymentHistoryService) { }

  //  Ver historial del empleado autenticado
  @Get()
  findOwnHistory(@Req() req: CustomRequest) {
    const userId = req.user.sub;
    return this.service.findByAuthenticatedUser(userId);
  }

  //  Ver todos los historiales del empleado autenticado por employeeId
  @Get('all')
  getAllEmploymentHistory(@Req() req: any) {
    const employeeId = req.user.employeeId;
    return this.service.getAllEmploymentHistory(employeeId);
  }

  //  Obtener rango de fechas del historial del empleado autenticado
  @Get('range')
  getDateRange(@Req() req: CustomRequest) {
    const employeeId = req.user.employeeId;
    return this.service.getHistoryDateRange(employeeId);
  }

  //  Obtener todas las fechas de inicio globales
  @Get('dates')
  getAllStartDates() {
    return this.service.getAllStartDates();
  }

  //  Actualizar historial laboral
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmploymentHistoryDto,
  ) {
    return this.service.update(id, updateDto);
  }

  // 
  @Get('admin/all')
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateEmploymentHistoryDto) {
    return this.service.create(dto);
  }
}
