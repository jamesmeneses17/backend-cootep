import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { CertificatesService } from './certificates.service';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { CustomRequest } from '../common/interfaces/custom-request.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Certificados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) { }

  @Post('generate')
  @ApiBody({ type: GenerateCertificateDto })
  async generateCertificatePDF(
    @Req() req: CustomRequest,
    @Body() body: GenerateCertificateDto,
    @Res() res: Response,
  ) {
    const employeeId = req.user.employeeId;

    const buffer = await this.certificatesService.generatePdfBufferByType(
      employeeId,
      body,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=certificado_${body.type}.pdf`,
    });

    res.send(buffer);
  }

  @Get('generate')
  @ApiQuery({ name: 'type', enum: ['salario', 'funciones', 'historial'] })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async generateCertificateGET(
    @Req() req: CustomRequest,
    @Query('type') type: 'salario' | 'funciones' | 'historial',
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const employeeId = req.user.employeeId;

    const dto: GenerateCertificateDto = {
      type,
      startDate,
      endDate,
    };

    const buffer = await this.certificatesService.generatePdfBufferByType(
      employeeId,
      dto,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=certificado_${type}.pdf`,
    });

    res.send(buffer);
  }
  @Get('range')
  async getEmploymentDateRange(@Req() req: CustomRequest) {
    const employeeId = req.user.employeeId;
    return await this.certificatesService.getHistoryDateRange(employeeId);
  }
  @Get('history-list')
  @UseGuards(JwtAuthGuard)
  getEmploymentHistories(@Req() req: CustomRequest) {
    const userId = req.user.sub;
    return this.certificatesService.getHistorySummaries(userId);
  }


}
