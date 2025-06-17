import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ImportExcelService {
  async processExcel(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[] = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      throw new BadRequestException('El archivo está vacío o mal formateado');
    }

    // Validación básica de columnas esperadas
    const requiredFields = ['nombres', 'apellidos', 'cedula', 'correo', 'cargo', 'tipoContrato', 'fechaIngreso'];
    const firstRow = Object.keys(data[0]);

    const missingFields = requiredFields.filter(f => !firstRow.includes(f));
    if (missingFields.length > 0) {
      throw new BadRequestException(`Faltan columnas requeridas: ${missingFields.join(', ')}`);
    }

    // Por ahora no se inserta nada. Solo vista previa.
    return {
      total: data.length,
      preview: data.slice(0, 5),
      message: 'Archivo leído correctamente',
    };
  }
}
