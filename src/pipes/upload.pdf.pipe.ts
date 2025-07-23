import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PdfFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File missing');
    }
    if (!file.mimetype.toLowerCase().includes('pdf')) {
      throw new BadRequestException('File must be a PDF');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 5MB');
    }
    return file;
  }
}
