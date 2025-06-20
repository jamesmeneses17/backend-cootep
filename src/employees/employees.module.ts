import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { EmploymentHistory } from '../employment-history/entities/employment-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, User, EmploymentHistory]),
    UsersModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
