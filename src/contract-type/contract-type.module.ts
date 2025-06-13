import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractTypeController } from './contract-type.controller';
import { ContractTypeService } from './contract-type.service';
import { ContractType } from './entities/contract-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContractType])],
  controllers: [ContractTypeController],
  providers: [ContractTypeService],
  exports: [ContractTypeService],
})
export class ContractTypeModule {}
