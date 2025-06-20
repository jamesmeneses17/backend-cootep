import { AppDataSource } from '../data-source';
import { seedEmpleados } from './seed-empleados';
import { seedRoles } from './seed-roles';
import { seedUsuarios } from './seed-usuarios';

// inserciones reales a la base de datos MySQL
// Usando objetos JavaScript (constantes) para estructurar los datos.
// usando TypeORM para guardar esos datos en la base real (MySQL

const run = async () => {
  await AppDataSource.initialize();

  await seedEmpleados();
  await seedRoles();
  await seedUsuarios();

  console.log('Todos los seeds ejecutados correctamente');
  process.exit(0);
};

run();
