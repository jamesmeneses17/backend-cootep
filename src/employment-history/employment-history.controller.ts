import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EmploymentHistoryService } from './employment-history.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { CustomRequest } from '../common/interfaces/custom-request.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateEmploymentHistoryDto } from './dto/update-employment-history.dto';

@ApiTags('EmploymentHistory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employment-history')
export class EmploymentHistoryController {
  constructor(private readonly service: EmploymentHistoryService) { }

  @Get()
  findOwnHistory(@Req() req: CustomRequest) {
    const userId = req.user.sub;
    return this.service.findByAuthenticatedUser(userId);
  }

  @Get('all')
  getAllEmploymentHistory(@Req() req: any) {
    const employeeId = req.user.employeeId;
    return this.service.getAllEmploymentHistory(employeeId);
  }

  @Get('range')
  getDateRange(@Req() req: CustomRequest) {
    const employeeId = req.user.employeeId;
    return this.service.getHistoryDateRange(employeeId);
  }

  @Get('dates')
  getAllStartDates() {
    return this.service.getAllStartDates();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmploymentHistoryDto,
  ) {
    return this.service.update(id, updateDto);
  }
}
