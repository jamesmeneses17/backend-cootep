import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EmploymentHistory } from '../employment-history/entities/employment-history.entity';
@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(EmploymentHistory)
    private employmentHistoryRepo: Repository<EmploymentHistory>,
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async findAll() {
    return await this.employeeRepository.find({
      relations: ['user', 'status', 'employment_history', 'employment_history.position'],
    });
  }



  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.preload({
      id,
      ...updateEmployeeDto,
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return await this.employeeRepository.save(employee);
  }

  async remove(id: number) {
    const employee = await this.employeeRepository.findOneBy({ id });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return await this.employeeRepository.remove(employee);
  }

  async getProfile(userId: number): Promise<PersonalInfoDto> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('ID de usuario inválido');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['employee'],
    });

    if (!user || !user.employee) {
      throw new NotFoundException('Empleado no encontrado en la base de datos');
    }

    const employee = user.employee;

    return {
      first_name: employee.first_name,
      last_name: employee.last_name,
      national_id: employee.national_id,
      email: user.email,
    };
  }

  async getEmploymentHistory(employeeId: number) {
    return this.employmentHistoryRepo.find({
      where: { employee: { id: employeeId } },
      order: { startDate: 'DESC' },
    });
  }
}
