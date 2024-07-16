import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IAppController } from './app.controller.interface';
import { EmailValidationSignUpRequestDto } from './dto/request/emailValidationSignUp.request.dto';
import { EmailValidationSignUpResponseDto } from './dto/response/emailValidationSignUp.response.dto';
import { ControllerResponseDto } from './dto/response/controller.response.dto';
import { ValidateSignUpCodeRequestDto } from './dto/request/validateSignUpCode.request.dto';
import { ValidateSignUpCodeResponseDto } from './dto/response/validateSignUpCode.response.dto';

@Controller()
export class AppController implements IAppController {
  constructor(private readonly service: AppService) {}

  @Post('signup')
  async emailValidateForSignUp(
    @Body() request: EmailValidationSignUpRequestDto,
  ): Promise<ControllerResponseDto<EmailValidationSignUpResponseDto>> {
    const data = await this.service.emailValidateForSignUp(request);

    return {
      data,
      statusCode: 201,
      statusMsg: '',
    };
  }

  @Post('validate')
  @HttpCode(200)
  async validateSignUpCode(
    @Body() request: ValidateSignUpCodeRequestDto,
  ): Promise<ControllerResponseDto<ValidateSignUpCodeResponseDto>> {
    const data = await this.service.validateSignUpCode(request);

    return {
      data,
      statusCode: 200,
      statusMsg: '',
    };
  }
}
