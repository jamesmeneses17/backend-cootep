import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmploymentHistory } from 'src/employment-history/entities/employment-history.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { generateHeader } from './pdf-templates/header.template';
import { generateSalaryContent } from './pdf-templates/type-salary.template';
import { generateFunctionsContent } from './pdf-templates/type-functions.template';
import { generateFooter } from './pdf-templates/footer.template';
import { generateHistoryContent } from './pdf-templates/type-history.template';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';

const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const fs = require('fs');
const path = require('path');

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,

    @InjectRepository(EmploymentHistory)
    private readonly historyRepo: Repository<EmploymentHistory>,
  ) { }

  async generatePdfBufferByType(
    employeeId: number,
    dto: GenerateCertificateDto,
  ): Promise<Buffer> {
    const { type, startDate, endDate, historyId } = dto;

    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Empleado no encontrado');

    const logoPath = path.join(process.cwd(), 'src', 'assets', 'logo_cootep.png');
    const signaturePath = path.join(process.cwd(), 'src', 'assets', 'firma.png');
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    const firmaBase64 = fs.readFileSync(signaturePath).toString('base64');

    const content = [...generateHeader()];

    if (type === 'salario' || type === 'funciones') {
      const selectedHistory = historyId
        ? await this.historyRepo.findOne({
          where: { id: historyId, employee: { id: employeeId } },
          relations: ['position', 'position.functions', 'contractType'],
        })
        : null;

      if (!selectedHistory) {
        throw new NotFoundException('Historial no encontrado para el empleado');
      }

      const filtered = [selectedHistory];

      if (type === 'salario') {
        content.push(...generateSalaryContent(employee, filtered));
      } else {
        const funciones = selectedHistory.position?.functions || [];
        content.push(...generateFunctionsContent(employee, funciones, filtered));
      }
    }

    if (type === 'historial') {
      const history = await this.historyRepo.find({
        where: { employee: { id: employeeId } },
        relations: ['position', 'position.functions', 'contractType'],
        order: { startDate: 'ASC' },
      });

      if (!history.length) throw new NotFoundException('Sin historial laboral');

      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const endF = endDate ? new Date(endDate) : new Date();

      const filteredHistory = history.filter(h => {
        const inicio = new Date(h.startDate);
        const fin = h.endDate ? new Date(h.endDate) : new Date();
        return inicio <= endF && fin >= start;
      });

      if (!filteredHistory.length) {
        throw new NotFoundException('No hay historial laboral en ese rango');
      }

      content.push(...generateHistoryContent(employee, filteredHistory));
    }

    const docDefinition = {
      content,
      images: {
        logo: 'data:image/png;base64,' + logoBase64,
        signature: 'data:image/png;base64,' + firmaBase64,
      },
      pageMargins: [60, 60, 60, 60],
      styles: {
        tituloInstitucional: { fontSize: 14, bold: true },
        subtitulo: { fontSize: 12, italics: true },
        negritaMayus: { fontSize: 14, bold: true, uppercase: true },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBuffer((buffer: Buffer) => resolve(buffer));
    });
  }

  async getHistoryDateRange(employeeId: number) {
    const history = await this.historyRepo.find({
      where: { employee: { id: employeeId } },
      select: ['startDate', 'endDate'],
    });

    if (!history.length) {
      return { startDates: [], endDates: [] };
    }

    const startDates = Array.from(
      new Set(
        history.map(h => new Date(h.startDate).toISOString().slice(0, 10))
      )
    ).sort();

    const endDates = Array.from(
      new Set(
        history
          .filter(h => h.endDate)
          .map(h => new Date(h.endDate!).toISOString().slice(0, 10))
      )
    ).sort();

    return { startDates, endDates };
  }

  async getHistorySummaries(employeeId: number) {
    const histories = await this.historyRepo.find({
      where: { employee: { id: employeeId } },
      relations: ['position'],
      order: { startDate: 'ASC' },
    });

    return histories.map(h => ({
      id: h.id,
      position: h.position.title,
      startDate: h.startDate,
      endDate: h.endDate,
    }));
  }

}
