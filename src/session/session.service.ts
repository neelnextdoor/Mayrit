import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionService {
  constructor(@InjectRepository(Session) private repo: Repository<Session>) {}

  async createSession(user_id: number, role_id?: number, country_id?: number) {
    const session = this.repo.create({
      session_id: uuidv4(),
      user_id,
      role_id,
      country_id
    });
    return this.repo.save(session);
  }

  async invalidateSession(session_id: string) {
    return this.repo.update({ session_id }, { is_active: false });
  }
}