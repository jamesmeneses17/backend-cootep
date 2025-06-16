import { Module } from '@nestjs/common';
import { FunctionsService } from './functions.service';
import { FunctionsController } from './functions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobFunction } from './entities/function.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobFunction])],
  controllers: [FunctionsController],
  providers: [FunctionsService],
})
export class FunctionsModule { }
