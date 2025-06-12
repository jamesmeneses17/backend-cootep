import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EmploymentHistory } from '../../employment-history/entities/employment-history.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  national_id: string;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ type: 'date' })
  birth_date: Date;

  @OneToOne(() => User, (user) => user.employee, { onDelete: 'CASCADE' })
  user: User;
  @OneToMany(() => EmploymentHistory, (history) => history.employee)
  historial: EmploymentHistory[];
  
}
