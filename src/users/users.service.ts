import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  // Crear usuario normal
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  // Listar todos los usuarios (con rol)
  findAll() {
    return this.userRepository.find({ relations: ['role'] });
  }

  // Buscar un usuario por ID
  findOne(id: number) {
    return this.userRepository.findOne({ where: { id }, relations: ['role'] });
  }

  // Actualizar un usuario
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  // Eliminar un usuario
  remove(id: number) {
    return this.userRepository.delete(id);
  }

  // 🔍 Listar solo usuarios administradores
  async findAdmins(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: { name: 'admin' } },
      relations: ['role'],
      order: { last_login: 'DESC' },
    });
  }

  // Crear administrador solo si es superadmin
  async createAdmin(currentUserId: number, dto: CreateUserDto) {
    const currentUser = await this.userRepository.findOneBy({
      id: currentUserId,
    });

    if (!currentUser?.is_superadmin) {
      throw new ForbiddenException('No autorizado para crear administradores.');
    }
    const adminRole = await this.roleRepository.findOneBy({ name: 'admin' });
    if (!adminRole) {
      throw new Error('No se encontró el rol de administrador.');
    }
    const newAdmin = this.userRepository.create({
      ...dto,
      role: adminRole,
      is_superadmin: false, // ← solo superadmin crea, pero los demás no son superadmins
    });

    return this.userRepository.save(newAdmin);
  }

  async findByCedula(cedula: string) {
    return this.userRepository.findOne({
      where: { cedula },
      relations: ['employee'],
    });
  }
  async updateRole(userId: number, roleId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.role = { id: roleId } as any; // Asumiendo relación ManyToOne
    return this.userRepository.save(user);
  }


}
