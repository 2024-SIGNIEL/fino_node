import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from 'src/dto/request/signIn.request.dto';
import { SignUpReq } from 'src/dto/request/signup.request.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signup')
  async signup(@Body() request: SignUpReq) {
    await this.service.signUp(request);

    return;
  }

  @Post('login')
  async signIn(@Body() request: SignInRequestDto) {
    const data = await this.service.signIn(request);

    return data;
  }

  @Get('info')
  @UseGuards(AuthGuard)
  async getInform(@Body() request) {
    const data = await this.service.getInform(request);

    return data;
  }
}
