import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractType } from './entities/contract-type.entity';
import { UpdateContractTypeDto } from './dto/update-contract-type.dto';

@Injectable()
export class ContractTypeService {
  constructor(
    @InjectRepository(ContractType)
    private contractTypeRepo: Repository<ContractType>,
  ) { }

  findAll() {
    return this.contractTypeRepo.find();
  }

  async update(id: number, updateDto: UpdateContractTypeDto) {
    const contract = await this.contractTypeRepo.preload({
      id,
      ...updateDto,
    });

    if (!contract) {
      throw new NotFoundException('Tipo de contrato no encontrado');
    }

    return this.contractTypeRepo.save(contract);
  }
}
