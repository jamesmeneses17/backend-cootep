import { AppDataSource as dataSource } from '../data-source';
import { Employee } from '../employees/entities/employee.entity';

export const seedEmpleados = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const employeeRepository = dataSource.getRepository(Employee);

  const empleados = [
    {
      first_name: 'Laura',
      last_name: 'Mora',
      national_id: '12345678',
      birth_date: new Date('1994-12-31'),
    },
    {
      first_name: 'Karen',
      last_name: 'Mora',
      national_id: '87654321', // diferente ID
      birth_date: new Date('1996-05-15'),
    },
    {
      first_name: 'Admin',
      last_name: 'Cootep',
      national_id: '99999999',
      birth_date: new Date('1990-01-01'),
    },
  ];

  for (const empData of empleados) {
    const exists = await employeeRepository.findOneBy({
      national_id: empData.national_id,
    });

    if (!exists) {
      const empleado = employeeRepository.create(empData);
      await employeeRepository.save(empleado);
      console.log(`✅ Empleado creado: ${empData.first_name}`);
    } else {
      console.log(`ℹ️ Empleado ya existe: ${empData.first_name}`);
    }
  }

  console.log('✅ Seed de empleados completado');
};
