import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('contract_types')
export class ContractType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;
}
