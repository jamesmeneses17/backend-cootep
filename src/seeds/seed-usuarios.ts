import { AppDataSource as dataSource } from '../data-source';
import { User } from '../users/entities/user.entity';
import { Employee } from '../employees/entities/employee.entity';
import * as bcrypt from 'bcrypt';

export const seedUsuarios = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const userRepository = dataSource.getRepository(User);
  const employeeRepository = dataSource.getRepository(Employee);

  // Buscar empleados existentes
  const empleadoLaura = await employeeRepository.findOneBy({
    national_id: '12345678',
  });

  const empleadoKaren = await employeeRepository.findOneBy({
    national_id: '87654321', // Cambia este ID si Karen tiene uno distinto
  });

  const empleadoAdmin = await employeeRepository.findOneBy({
    national_id: '99999999',
  });

  if (!empleadoLaura || !empleadoAdmin || !empleadoKaren) {
    console.error(
      ' Faltan empleados requeridos. Verifica el seed de empleados.',
    );
    return;
  }

  const passwordHash = 'admin'; // sin encriptar

  const usuarios = [
    {
      email: 'empleado@cotep.com',
      password: passwordHash,
      cedula: '12345678',
      role: { id: 2 },
      employee: empleadoLaura,
    },
    {
      email: 'admin@cootep.com',
      password: passwordHash,
      cedula: '123456',
      role: { id: 1 },
      employee: empleadoAdmin,
    },
    {
      email: 'karen@cootep.com',
      password: passwordHash,
      cedula: '87654321',
      role: { id: 2 },
      employee: empleadoKaren,
    },
  ];

  for (const user of usuarios) {
    const exists = await userRepository.findOneBy({ email: user.email });
    if (!exists) {
      await userRepository.save(user);
      console.log(`✅ Usuario creado: ${user.email}`);
    } else {
      console.log(`ℹ️ Usuario ya existe: ${user.email}`);
    }
  }

  console.log('✅ Seed de usuarios completado');
};
