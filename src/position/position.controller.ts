import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { PositionsService } from './position.service';
import { UpdatePositionDto } from './dto/update-position.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Positions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) { }

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Post()
  create(@Body() createDto: CreatePositionDto) {
    return this.positionsService.create(createDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePositionDto,
  ) {
    return this.positionsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }

}
