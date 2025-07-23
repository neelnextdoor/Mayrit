import { Module } from '@nestjs/common';
import { GeminiImageService } from './image.service';
import { ImageController } from './image.controller';
import {JwtAuthGuard} from "../auth/gaurds/jwt-auth.guard";

@Module({
  controllers: [ImageController],
  providers: [GeminiImageService,JwtAuthGuard],
})
export class ImageModule {}
