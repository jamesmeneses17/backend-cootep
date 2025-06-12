import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmploymentHistory } from 'src/employment-history/entities/employment-history.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { generateHeader } from './pdf-templates/header.template';
import { generateSalaryContent } from './pdf-templates/type-salary.template';

const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

// Usa la fuente por defecto de pdfmake (Roboto)
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
  ) {}

  async generatePdfBufferByType(
    employeeId: number,
    type: 'salario' | 'funciones' | 'historial',
  ): Promise<Buffer> {
    // Buscar empleado
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Empleado no encontrado');

    // Buscar historial laboral
    const history = await this.historyRepo.find({
      where: { employee: { id: employeeId } },
      relations: ['position', 'contractType'],
      order: { startDate: 'ASC' },
    });

    if (!history.length) throw new NotFoundException('Sin historial laboral');

    // Archivos
    const logoPath = path.join(
      process.cwd(),
      'src',
      'assets',
      'logo_cootep.png',
    );
    const signaturePath = path.join(
      process.cwd(),
      'src',
      'assets',
      'firma.png',
    );
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    const firmaBase64 = fs.readFileSync(signaturePath).toString('base64');

    const content = [...generateHeader()];
    content.push(...generateSalaryContent(employee, history));

    const docDefinition = {
      content,
      images: {
        logo: 'data:image/png;base64,' + logoBase64,
        signature: 'data:image/png;base64,' + firmaBase64,
      },
      pageMargins: [60, 60, 60, 60], // izquierda, arriba, derecha, abajo
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
}
