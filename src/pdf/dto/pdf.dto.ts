import {IsString, IsIn, Min, Max, Matches, IsOptional, IsUrl} from 'class-validator';

export class UploadFileDto {
  @IsString()
  @Matches(/^(100|[1-9][0-9]?)$/, { message: 'maxCount must be a number between 1 and 100' })
  maxCount: string;

  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  level: string;

  @IsOptional()
  @IsUrl()
  imageUrl : string

  @IsOptional()
  @IsUrl()
  pdfUrl : string

  @IsString()
  @IsIn(['mcq', 'flash'])
  type: string
}
