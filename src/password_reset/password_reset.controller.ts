import { Controller, Post, Body } from '@nestjs/common';
import { PasswordResetService } from './password_reset.service';

@Controller('password')
export class PasswordResetController {
  constructor(private readonly prService: PasswordResetService) {}

  @Post('request')
  request(@Body('email') email: string) {
    return this.prService.requestReset(email);
  }

  @Post('reset')
  reset(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.prService.resetPassword(token, password);
  }
}
