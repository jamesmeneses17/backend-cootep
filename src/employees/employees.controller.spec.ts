import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

// Mock del servicio de empleados
const mockEmployeeService = {
  getProfile: jest.fn().mockResolvedValue({
    first_name: 'Mock',
    last_name: 'User',
    national_id: '00000000',
    email: 'mock@cotep.com',
  }),
};

describe('EmployeesController', () => {
  let controller: EmployeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return employee personal info (mocked)', async () => {
    const mockReq = { user: { sub: 1 } } as any;
    const result = await controller.getProfile(mockReq);

    expect(result).toEqual({
      first_name: 'Mock',
      last_name: 'User',
      national_id: '00000000',
      email: 'mock@cotep.com',
    });
  });
});
