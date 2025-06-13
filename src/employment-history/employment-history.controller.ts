import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { EmploymentHistoryService } from './employment-history.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { CustomRequest } from '../common/interfaces/custom-request.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
  @UseGuards(JwtAuthGuard)
  getAllEmploymentHistory(@Req() req: any) {
    const employeeId = req.user.employeeId;
    return this.service.getAllEmploymentHistory(employeeId);
  }

  @Get('range')
  @UseGuards(JwtAuthGuard)
  async getDateRange(@Req() req: CustomRequest) {
    const employeeId = req.user.employeeId;
    return this.service.getHistoryDateRange(employeeId);
  }

  @Get('dates')
  @UseGuards(JwtAuthGuard)
  getAllStartDates() {
    return this.service.getAllStartDates();
  }





}
