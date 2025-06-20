import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFunctionDto } from './dto/create-function.dto';
import { UpdateFunctionDto } from './dto/update-function.dto';
import { JobFunction } from './entities/function.entity';

@Injectable()
export class FunctionsService {
  constructor(
    @InjectRepository(JobFunction)
    private readonly functionRepository: Repository<JobFunction>,
  ) { }

  create(createFunctionDto: CreateFunctionDto) {
    const nuevaFuncion = this.functionRepository.create(createFunctionDto);
    return this.functionRepository.save(nuevaFuncion);
  }

  async findAll() {
    return this.functionRepository.find({
      relations: ['position'],
    });
  }

  findOne(id: number) {
    return this.functionRepository.findOne({
      where: { id },
      relations: ['position'],
    });
  }

  update(id: number, updateFunctionDto: UpdateFunctionDto) {
    return this.functionRepository.update(id, updateFunctionDto);
  }

  async remove(id: number) {
    return this.functionRepository.delete(id);
  }
}
