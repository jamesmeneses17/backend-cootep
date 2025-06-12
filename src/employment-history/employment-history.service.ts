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
}
