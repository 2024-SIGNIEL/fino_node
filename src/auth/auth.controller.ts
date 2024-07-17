import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from 'src/dto/request/signIn.request.dto';
import { SignUpReq } from 'src/dto/request/signup.request.dto';
import { AuthGuard } from './auth.guard';
import { ModifyInformRequestDto } from 'src/dto/request/modifyInform.request.dto';
import { EmailValidationSignUpRequestDto } from 'src/dto/request/emailValidationSignUp.request.dto';
import { ValidateSignUpCodeRequestDto } from 'src/dto/request/validateSignUpCode.request.dto';
import { EmailValidationSignUpResponseDto } from 'src/dto/response/emailValidationSignUp.response.dto';
import { ValidateSignUpCodeResponseDto } from 'src/dto/response/validateSignUpCode.response.dto';

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

  @Patch('modify')
  @UseGuards(AuthGuard)
  async modifyInform(@Body() request: ModifyInformRequestDto) {
    const data = await this.service.modifyInform(request);

    return data;
  }

  @Post('send')
  async emailValidateForSignUp(
    @Body() request: EmailValidationSignUpRequestDto,
  ): Promise<EmailValidationSignUpResponseDto> {
    const data = await this.service.emailValidateForSignUp(request);

    return data;
  }

  @Post('validate')
  @HttpCode(200)
  async validateSignUpCode(
    @Body() request: ValidateSignUpCodeRequestDto,
  ): Promise<ValidateSignUpCodeResponseDto> {
    const data = await this.service.validateSignUpCode(request);

    return data;
  }

  @Delete('logout')
  @UseGuards(AuthGuard)
  async logout(@Body() request) {
    await this.service.logout(request);
  }
}
