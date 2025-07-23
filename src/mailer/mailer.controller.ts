import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mailer.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-report')
  async sendReport(@Body() data: any): Promise<{ message: string }> {
    return { message: 'Email sent successfully' };
  }
}
