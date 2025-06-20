import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('admins')
  findAdmins() {
    return this.usersService.findAdmins();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('by-cedula/:cedula')
  findByCedula(@Param('cedula') cedula: string) {
    return this.usersService.findByCedula(cedula);
  }

  @Patch(':id/role')
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role_id') roleId: number,
  ) {
    return this.usersService.updateRole(id, roleId);
  }

  // ✅ Nuevo endpoint para degradar a empleado
  @Patch(':id/downgrade')
  downgradeToEmployee(@Param('id', ParseIntPipe) id: number) {
    const EMPLOYEE_ROLE_ID = 2;
    return this.usersService.updateRole(id, EMPLOYEE_ROLE_ID);
  }
}
