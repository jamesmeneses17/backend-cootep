import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Position } from '../../position/entities/position.entity';

@Entity('job_functions')
export class JobFunction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    positionId: number;

    @ManyToOne(() => Position, position => position.functions, { eager: true })
    @JoinColumn({ name: 'positionId' })
    position: Position;
}
