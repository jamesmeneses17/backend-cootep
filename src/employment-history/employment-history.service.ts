import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmploymentHistory } from './entities/employment-history.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmploymentHistoryService {
  constructor(
    @InjectRepository(EmploymentHistory)
    private readonly employmentHistoryRepo: Repository<EmploymentHistory>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

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

  async getAllEmploymentHistory(employeeId: number) {
  return this.employmentHistoryRepo.find({
    where: { employee: { id: employeeId } },
    relations: ['position', 'contractType'],
    order: { startDate: 'ASC' },
  });
}

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





}
