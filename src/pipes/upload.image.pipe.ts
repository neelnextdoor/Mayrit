import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File missing');
    }
    const allowedTypes = ['jpg','jpeg', 'png'];

    if (!file.mimetype || !allowedTypes.some(type => file.mimetype.includes(type))) {
      throw new BadRequestException('Only JPG, JPEG and PNG files are allowed!');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 5MB');
    }
    return file;
  }
}
