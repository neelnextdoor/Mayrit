import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './password_reset_token.entity';
import { PasswordResetService } from './password_reset.service';
import { PasswordResetController } from './password_reset.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetToken]), UsersModule],
  providers: [PasswordResetService],
  controllers: [PasswordResetController],
})
export class PasswordResetModule {}
