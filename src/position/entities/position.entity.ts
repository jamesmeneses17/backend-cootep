// src/position/entities/position.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;
}
