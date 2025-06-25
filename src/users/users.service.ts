import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const password_hash = await bcrypt.hash(dto.password, 10);
      const user = this.userRepo.create({...dto, password_hash,ref_id: uuidv4()});
      return this.userRepo.save(user);
    }catch (e) {
      console.log(e);
    }
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const password_hash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update({ id: userId }, { password_hash });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    return isMatch ? user : null;
  }


  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }


}
