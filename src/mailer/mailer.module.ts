import { Module } from '@nestjs/common';
import { MailService } from './mailer.service';
import {MailController} from "./mailer.controller";

@Module({
  controllers:[MailController],
  providers: [MailService],
  exports: [MailService], // export if you want to use it elsewhere
})
export class MailModule {}
