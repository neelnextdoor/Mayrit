import {ConflictException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {CreateUserDto} from "../users/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(data : CreateUserDto) {
    try {
      const user = await this.usersService.create(data);

      return this.login(user);
    }catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists.');
      }
      throw new InternalServerErrorException('Failed to create user');    }
  }
}
