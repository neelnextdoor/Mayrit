import { Module } from '@nestjs/common';
import { GeminiImageService } from './image.service';
import { ImageController } from './image.controller';

@Module({
  controllers: [ImageController],
  providers: [GeminiImageService],
})
export class ImageModule {}
