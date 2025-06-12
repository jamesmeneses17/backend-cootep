import { AppDataSource as dataSource } from '../data-source';
import { Role } from '../roles/entities/role.entity';

export const seedRoles = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'empleado' },
  ];

  for (const role of roles) {
    const exists = await roleRepository.findOneBy({ id: role.id });
    if (!exists) {
      await roleRepository.save(role);
    }
  }

  console.log('Seed de roles completado');
};
