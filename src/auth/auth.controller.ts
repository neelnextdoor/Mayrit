import {Controller, Post, Body, Req, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {Response} from "express";

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() request : CreateUserDto , @Res() res : Response) {
    let result = await this.authService.signup(request);
    res.status(200).json({ success: true, message :"Signup successfully, Please use access token to authorise the APIs.",data: result });

  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res : Response
  ) {
    const user = await this.authService.validateUser(email, password);
    const token = await this.authService.login(user);
    res.status(200).json({ success: true, message :"Login successfully.",data: token });
  }
}
