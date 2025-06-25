import {Controller, Post, Body, Req, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import {CreateUserDto} from "../users/dto/create-user.dto";

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() request : CreateUserDto , @Res() res : Response) {
    return this.authService.signup(request);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user);
  }
}
