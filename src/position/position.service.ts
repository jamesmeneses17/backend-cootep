import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
    constructor(
        @InjectRepository(Position)
        private readonly positionRepository: Repository<Position>,
    ) { }

    findAll() {
        return this.positionRepository.find();
    }

    async update(id: number, updateDto: UpdatePositionDto) {
        const position = await this.positionRepository.preload({
            id,
            ...updateDto,
        });

        if (!position) {
            throw new NotFoundException('Cargo no encontrado');
        }

        return this.positionRepository.save(position);
    }
}
