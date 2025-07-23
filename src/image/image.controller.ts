import {
    Controller,
    Post,
    UploadedFile,
    Body,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
    Res, UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeminiImageService } from './image.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import {ImageFileValidationPipe} from "../pipes/upload.image.pipe";
import {UploadFileDto} from "../pdf/dto/pdf.dto";
import {Response} from "express";
import {displayImageErrorMessage, extractJSONFromLLMResponse, generateMCQPrompt} from "../prompts/common.function";
import {JwtAuthGuard} from "../auth/gaurds/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('image')
export class ImageController {
  constructor(private readonly geminiImageService: GeminiImageService) {}

  // 1. Upload and process image using the Files API (for >20MB or reuse)
  @Post('upload')
  @UseInterceptors( FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/image',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${path.basename(file.originalname, ext)}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      })
    }),
    )

  @UsePipes(new ValidationPipe({ transform: true }))
  async generateFromUploadedFile(
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
    @Body() body : UploadFileDto,
    @Res() res: Response) {
    try{
        const prompt = generateMCQPrompt(body.maxCount, body.level);
        const llmText = await this.geminiImageService.generateFromUploadedFile(
        file.path,
        prompt,
        );
        let questions;
        try {
          questions = await extractJSONFromLLMResponse(llmText);
        } catch {
          return res.status(400).json({ success: false, error: "Failed to parse AI response. Please try again." });
        }

        res.status(200).json({ success: true, data: questions });
        
    }catch (error) {
      const message = await displayImageErrorMessage(error);
      return res.status(400).json({ success: false, error: message });
    }
  }
    
  // 2. Inline local image file (<20MB)
  @Post('inline')
  @UseInterceptors(FileInterceptor('image'))

  @UsePipes(new ValidationPipe({ transform: true }))
  async generateFromInlineFile(
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
    @Body() body : UploadFileDto,
    @Res() res: Response) {
    try{
        const prompt = generateMCQPrompt(body.maxCount, body.level);
        const llmText = await this.geminiImageService.generateFromInlineFile(
          file.path,
          prompt,
        );
        let questions;
        try {
          questions = await extractJSONFromLLMResponse(llmText);
        } catch {
          return res.status(400).json({ success: false, error: "Failed to parse AI response. Please try again." });
        }

        res.status(200).json({ success: true, data: questions });
    }catch(error){
        const message = await displayImageErrorMessage(error);
        return res.status(400).json({ success: false, error: message });    }
  }

  // 3. Inline image from a URL
  @Post('url')
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateFromImageUrl(
    @Body() body: UploadFileDto,
    @Res() res: Response
  ) {
      try {
          const prompt = generateMCQPrompt(body.maxCount, body.level);
          const llmText = await this.geminiImageService.generateFromImageUrl(
              body.imageUrl,
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
        const message = await displayImageErrorMessage(error);
        return res.status(400).json({ success: false, error: message });
      }
  }
}
