import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cedula: string;

  @Column()
  password: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ type: 'datetime', nullable: true })
  last_login: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  resetToken: string | null;

  @Column({ nullable: true, type: 'datetime' })
  resetTokenExpires: Date | null;

  @Column({ default: false })
  isTempPassword: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  refreshToken?: string;

  @Column({ default: false })
  is_superadmin: boolean;

}
