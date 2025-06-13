import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PositionsService } from './position.service';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Positions')
@Controller('positions')
@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) { }

    @Get()
    findAll() {
        return this.positionsService.findAll();
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdatePositionDto,
    ) {
        return this.positionsService.update(id, updateDto);
    }
}
