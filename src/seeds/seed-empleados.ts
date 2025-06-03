import { AppDataSource as dataSource } from '../data-source';
import { User } from '../users/entities/user.entity';
import { Employee } from '../employees/entities/employee.entity';
import * as bcrypt from 'bcrypt';

export const seedEmpleados = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const userRepository = dataSource.getRepository(User);
  const employeeRepository = dataSource.getRepository(Employee);

  // Crear empleado
  // define un objeto
  const empleado = employeeRepository.create({
    first_name: 'Laura',
    last_name: 'Mora',
    national_id: '12345678',
    birth_date: new Date('1995-01-01'),
  });
  // Guarda el empleado en la base de datos
  await employeeRepository.save(empleado);

  // Crear usuario asociado
  const user = userRepository.create({
    email: 'laura@cotep.com',
    password: await bcrypt.hash('123456', 10),
    cedula: '12345678',
    role: { id: 2 },
    employee: empleado,
  });
  await userRepository.save(user);

  console.log('seed de empleado completado');
};
