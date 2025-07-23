import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import {JwtAuthGuard} from "../auth/gaurds/jwt-auth.guard";

@Module({
  controllers: [PdfController],
  providers: [PdfService,JwtAuthGuard],
})
export class PdfModule {}
