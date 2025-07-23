import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PdfService } from './pdf.service';
import { Response} from 'express';
import {UploadFileDto} from "./dto/pdf.dto";
import {PdfFileValidationPipe} from "../pipes/upload.pdf.pipe";
import {generateMCQPrompt,extractJSONFromLLMResponse} from "../prompts/common.function";

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/pdf',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async uploadFile(
      @UploadedFile(PdfFileValidationPipe) file: Express.Multer.File,
      @Body() body: UploadFileDto,
      @Res() res: Response) {
      try {
        const prompt = generateMCQPrompt(body.maxCount, body.level);

        const llmText = await this.pdfService.processPdf(file.path, prompt);

        let questions;
        try {
          questions = await extractJSONFromLLMResponse(llmText);
          // optionally validate structure of each item here
        } catch {
          return res.status(400).json({ success: false, error: "Failed to parse AI response. Please try again." });
        }

        res.status(200).json({ success: true, data: questions });
      } catch (error) {
        let displayMessage = 'An unexpected error occurred.';

        if (error.message && error.message.toLowerCase().includes('invalid pdf')) {
          displayMessage =
            'The uploaded file is not a valid or readable PDF. Please check the file and try again.';
        } else if (error.message && error.message.toLowerCase().includes('password')) {
          displayMessage =
            'The PDF is password-protected and cannot be processed.';
        } else {
          displayMessage =
            'Failed to process the PDF. Please make sure it is a valid, unencrypted PDF, and try again.';
        }

        res.status(400).json({ success: false, error: displayMessage });
      }
    }

}
