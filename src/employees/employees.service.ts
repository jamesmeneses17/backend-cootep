import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee';
  }

  findAll() {
    return `This action returns all employees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async getProfile(userId: number): Promise<PersonalInfoDto> {
    const employee = await this.employeeRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado en la base de datos');
    }

    return {
      first_name: employee.first_name,
      last_name: employee.last_name,
      national_id: employee.national_id,
      email: employee.user.email,
    };
  }
}
