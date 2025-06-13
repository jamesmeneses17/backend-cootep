import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ContractTypeService } from './contract-type.service';
import { UpdateContractTypeDto } from './dto/update-contract-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ContractType')
@Controller('contract-type')
@Controller('contract-type')
export class ContractTypeController {
  constructor(private readonly contractTypeService: ContractTypeService) { }

  @Get()
  findAll() {
    return this.contractTypeService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateContractTypeDto,
  ) {
    return this.contractTypeService.update(id, updateDto);
  }
}
