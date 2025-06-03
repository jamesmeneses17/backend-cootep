import { AppDataSource } from '../data-source';
import { seedEmpleados } from './seed-empleados';

// inserciones reales a la base de datos MySQL
// Usando objetos JavaScript (constantes) para estructurar los datos.
// usando TypeORM para guardar esos datos en la base real (MySQL

const run = async () => {
  await AppDataSource.initialize();

  await seedEmpleados();

  console.log('Todos los seeds ejecutados correctamente');
  process.exit(0);
};

run();
