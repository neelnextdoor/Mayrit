import { Controller, Post, Body, Delete } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private service: SessionService) {}

  @Post()
  create(@Body('user_id') userId: number) {
    return this.service.createSession(userId);
  }

  @Delete()
  invalidate(@Body('session_id') sessionId: string) {
    return this.service.invalidateSession(sessionId);
  }
}

