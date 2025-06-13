import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.employeesService.findPaginated(+page, +limit);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.employeesService.getProfile(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
  @ApiBearerAuth()
  @Get('historial')
  @UseGuards(JwtAuthGuard)
  getOwnHistory(@Req() req) {
    const employeeId = req.user.employeeId;
    return this.employeesService.getEmploymentHistory(employeeId);
  }

  @Get(':id/details')
  getDetailedView(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOneWithDetails(id);
  }


}
