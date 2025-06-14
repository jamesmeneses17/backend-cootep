import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmploymentHistory } from './entities/employment-history.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateEmploymentHistoryDto } from './dto/update-employment-history.dto';
import { CreateEmploymentHistoryDto } from './dto/create-employment-history.dto';

@Injectable()
export class EmploymentHistoryService {
  constructor(
    @InjectRepository(EmploymentHistory)
    private readonly employmentHistoryRepo: Repository<EmploymentHistory>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 🔒 Historial del usuario autenticado
  async findByAuthenticatedUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['employee'],
    });

    if (!user?.employee) throw new NotFoundException('Empleado no encontrado');

    return this.employmentHistoryRepo.findOne({
      where: { employee: { id: user.employee.id } },
      order: { startDate: 'DESC' },
    });
  }

  // Todos los historiales de un empleado específico
  async getAllEmploymentHistory(employeeId: number) {
    return this.employmentHistoryRepo.find({
      where: { employee: { id: employeeId } },
      relations: ['position', 'contractType'],
      order: { startDate: 'ASC' },
    });
  }

  // Rango de fechas de un empleado
  async getHistoryDateRange(employeeId: number) {
    const history = await this.employmentHistoryRepo.find({
      where: { employee: { id: employeeId } },
      select: ['startDate', 'endDate'],
    });

    if (!history.length) return { startDates: [], endDates: [] };

    const startDates = Array.from(
      new Set(history.map(h => new Date(h.startDate).toISOString().slice(0, 10)))
    ).sort();

    const endDates = Array.from(
      new Set(
        history
          .filter(h => h.endDate)
          .map(h => new Date(h.endDate!).toISOString().slice(0, 10))
      )
    ).sort();

    return { startDates, endDates };
  }

  // Todas las fechas de inicio únicas globales
  async getAllStartDates(): Promise<string[]> {
    const result = await this.employmentHistoryRepo
      .createQueryBuilder('h')
      .select('DISTINCT h.startDate', 'date')
      .orderBy('h.startDate', 'ASC')
      .getRawMany();

    return result.map(r => r.date);
  }

async update(id: number, dto: UpdateEmploymentHistoryDto) {
  const history = await this.employmentHistoryRepo.findOne({
    where: { id },
    relations: ['position', 'contractType'],
  });

  if (!history) {
    throw new NotFoundException('Historial no encontrado');
  }

  if (dto.salary !== undefined) {
    history.salary = dto.salary;
  }

  if (dto.startDate) {
    history.startDate = new Date(dto.startDate);
  }

  if (dto.endDate !== undefined) {
    history.endDate = dto.endDate ? new Date(dto.endDate) : null;
  }

  if (dto.positionId !== undefined) {
    history.position = { id: dto.positionId } as any;
  }

  if (dto.contractTypeId !== undefined) {
    history.contractType = { id: dto.contractTypeId } as any;
  }

  return this.employmentHistoryRepo.save(history);
}



  // Traer todos los historiales laborales (modo admin)
  async findAll() {
    return this.employmentHistoryRepo.find({
      relations: ['employee', 'position', 'contractType'],
      order: { startDate: 'DESC' },
    });
  }

  // Crear nuevo historial
  async create(dto: CreateEmploymentHistoryDto) {
    const { employeeId, positionId, contractTypeId, ...rest } = dto;

    const history = this.employmentHistoryRepo.create({
      ...rest,
      employee: { id: employeeId },
      position: { id: positionId },
      contractType: { id: contractTypeId },
    });

    return this.employmentHistoryRepo.save(history);
  }
}
