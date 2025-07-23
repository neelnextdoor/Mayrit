import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from './password_reset_token.entity';
import { UsersService } from '../users/users.service';
import { v4 as uuid } from 'uuid';
import {MailService} from "../mailer/mailer.service";

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly resetRepo: Repository<PasswordResetToken>,
    private readonly usersService: UsersService,
    private readonly mailService : MailService
  ) {}

  async requestReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const token = uuid();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 mins
    await this.resetRepo.save({ token, userId: user.id, expiresAt });
    await this.mailService.sendEmail(token,expiresAt,email);

    return { message: 'If Email exist, password reset request has been sent successfully.' };
  }

  async resetPassword(token: string, password: string) {
    const record = await this.resetRepo.findOne({ where: { token } });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Token invalid or expired');
    }
    await this.usersService.updatePassword(record.userId, password);
    await this.resetRepo.delete(record.id);
    return { success: true };
  }
}
