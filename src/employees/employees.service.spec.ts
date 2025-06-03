import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

describe('EmployeesService', () => {
  let service: EmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          } as Partial<Repository<Employee>>,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          } as Partial<Repository<User>>,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
