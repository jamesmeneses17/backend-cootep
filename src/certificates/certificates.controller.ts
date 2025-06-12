import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { CertificatesService } from './certificates.service';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { CustomRequest } from '../common/interfaces/custom-request.interface';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Certificados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

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
      body.type,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=certificado_${body.type}.pdf`,
    });

    res.send(buffer);
  }
}
