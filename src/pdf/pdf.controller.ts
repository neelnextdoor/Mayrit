import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Body,
  UsePipes,
  ValidationPipe, UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PdfService } from './pdf.service';
import { Response} from 'express';
import {UploadFileDto} from "./dto/pdf.dto";
import {PdfFileValidationPipe} from "../pipes/upload.pdf.pipe";
import {
    generateMCQPrompt,
    extractJSONFromLLMResponse,
    displayPdfErrorMessage,
    generateFlashPrompt
} from "../prompts/common.function";
import {JwtAuthGuard} from "../auth/gaurds/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
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
          let prompt = null;
        switch (body.type) {
            case 'mcq':
                prompt = generateMCQPrompt(body.maxCount, body.level);
                break;

            case 'flash':
                prompt = generateFlashPrompt(body.maxCount, body.level);
                break;

            default:
                prompt = generateMCQPrompt(body.maxCount, body.level);
        }

        const llmText = await this.pdfService.processPdf(file.path, prompt);
        let questions;
        try {
          questions = await extractJSONFromLLMResponse(llmText);
        } catch {
          return res.status(400).json({ success: false, error: "Failed to parse AI response. Please try again." });
        }
        res.status(200).json({ success: true, data: questions });
      } catch (error) {
        let displayMessage = await displayPdfErrorMessage(error);
        res.status(400).json({ success: false, error: displayMessage });
      }
  }


  //  Inline pdf from a URL
  @Post('url')
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateFromPdfUrl(
    @Body() body: UploadFileDto,
    @Res() res: Response
  ) {
      try {
        let prompt = null;
        switch (body.type) {
            case 'mcq':
                prompt = generateMCQPrompt(body.maxCount, body.level);
                break;

            case 'flash':
                prompt = generateFlashPrompt(body.maxCount, body.level);
                break;

            default:
                prompt = generateMCQPrompt(body.maxCount, body.level);
        }
          const llmText = await this.pdfService.generateFromPdfUrl(
              body.pdfUrl,
              prompt,
          );

          let questions;
          try {
              questions = await extractJSONFromLLMResponse(llmText);
          } catch {
              return res.status(400).json({success: false, error: "Failed to parse AI response. Please try again."});
          }

          res.status(200).json({success: true, data: questions});
      } catch (error) {
        console.log(error);
        const message = await displayPdfErrorMessage(error);
        return res.status(400).json({ success: false, error: message });
      }
  }

}
