import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobFunction } from '../../functions/entities/function.entity';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @OneToMany(() => JobFunction, jobFunction => jobFunction.position)
  functions: JobFunction[];
}
