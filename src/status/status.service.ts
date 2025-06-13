import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  create(createStatusDto: CreateStatusDto) {
    const status = this.statusRepository.create(createStatusDto);
    return this.statusRepository.save(status);
  }

  findAll() {
    return this.statusRepository.find();
  }

  async findOne(id: number) {
    const status = await this.statusRepository.findOneBy({ id });
    if (!status) throw new NotFoundException('Estado no encontrado');
    return status;
  }

  async update(id: number, updateStatusDto: UpdateStatusDto) {
    const status = await this.statusRepository.preload({ id, ...updateStatusDto });
    if (!status) throw new NotFoundException('Estado no encontrado');
    return this.statusRepository.save(status);
  }

  async remove(id: number) {
    const status = await this.findOne(id);
    return this.statusRepository.remove(status);
  }
}
