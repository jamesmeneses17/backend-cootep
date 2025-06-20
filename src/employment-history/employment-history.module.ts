import { Module } from '@nestjs/common';
import { EmploymentHistoryService } from './employment-history.service';
import { EmploymentHistoryController } from './employment-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploymentHistory } from './entities/employment-history.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentHistory, User])],
  controllers: [EmploymentHistoryController],
  providers: [EmploymentHistoryService],
})
export class EmploymentHistoryModule {}
