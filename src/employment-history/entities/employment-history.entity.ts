// src/employment-history/entities/employment-history.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Employee } from '../../employees/entities/employee.entity';
import { ContractType } from '../../contract-type/entities/contract-type.entity';
import { Position } from '../../position/entities/position.entity';

@Entity('employment_history')
export class EmploymentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null; // ✅ Ahora permite null sin error de tipo

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @ManyToOne(() => ContractType, { eager: true })
  @JoinColumn({ name: 'contractTypeId' })
  contractType: ContractType;

  @ManyToOne(() => Position, { eager: true })
  @JoinColumn({ name: 'positionId' })
  position: Position;

  @Column({ type: 'text', nullable: true })
  dutiesDescription: string;

  @ManyToOne(() => Employee, (emp) => emp.employment_history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
