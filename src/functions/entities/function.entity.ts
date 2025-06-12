import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Position } from '../../position/entities/position.entity';

@Entity('job_functions')
export class JobFunction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @ManyToOne(() => Position, position => position.functions, { eager: true })
    position: Position;
}
