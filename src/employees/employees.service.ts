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
import { CreateFullEmployeeDto } from './dto/create-full-employee.dto';

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
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['user', 'status'],
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    // Actualiza datos personales
    employee.first_name = updateEmployeeDto.first_name ?? employee.first_name;
    employee.last_name = updateEmployeeDto.last_name ?? employee.last_name;
    employee.national_id = updateEmployeeDto.national_id ?? employee.national_id;
    employee.birth_date = updateEmployeeDto.birth_date ?? employee.birth_date;

    // Actualiza status
    if (updateEmployeeDto.statusId) {
      employee.status = { id: updateEmployeeDto.statusId } as any;
    }

    // Actualiza datos del usuario (correo y rol)
    if (updateEmployeeDto.email || updateEmployeeDto.roleId) {
      const user = await this.userRepository.findOne({
        where: { employee: { id } },
        relations: ['role'],
      });



      if (user) {
        if (updateEmployeeDto.email) user.email = updateEmployeeDto.email;
        if (updateEmployeeDto.roleId) user.role = { id: updateEmployeeDto.roleId } as any;
        await this.userRepository.save(user);
      }
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

  async findPaginated(page: number, limit: number) {
    const [data, total] = await this.employeeRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: [
        'user',
        'status',
        'employment_history',
        'employment_history.position',
      ],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  async findOneWithDetails(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: [
        'user',
        'user.role',
        'status',
        'employment_history',
        'employment_history.position',
        'employment_history.contractType',
      ],
    });

    if (!employee) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return {
      ...employee,
      latestEmployment: employee.employment_history.sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )[0],
    };
  }
 async createWithUser(dto: CreateFullEmployeeDto) {
  const { email, national_id, statusId, ...employeeData } = dto;

  // 1. Crear el empleado
  const employee = this.employeeRepository.create({
    ...employeeData,
    national_id,
    birth_date: new Date(dto.birth_date),
    status: { id: statusId },
  });

  await this.employeeRepository.save(employee);

  // 2. Crear el usuario relacionado
  const user = this.userRepository.create({
    email,
    cedula: national_id,
    password: national_id, // la contraseña es igual a la cédula
    role: { id: 2 }, // empleado
    employee: employee,
  });

  await this.userRepository.save(user);

  // 3. Retornar el empleado con relaciones
  return this.employeeRepository.findOne({
    where: { id: employee.id },
    relations: ['user', 'status'],
  });
}





}
