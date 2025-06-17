import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportExcelService } from './import-excel.service';

@Controller('import-excel')
export class ImportExcelController {
  constructor(private readonly importExcelService: ImportExcelService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.importExcelService.processExcel(file);
  }
}
