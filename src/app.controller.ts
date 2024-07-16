import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IAppController } from './app.controller.interface';
import { EmailValidationSignUpRequestDto } from './dto/request/emailValidationSignUp.request.dto';
import { EmailValidationSignUpResponseDto } from './dto/response/emailValidationSignUp.response.dto';

@Controller()
export class AppController implements IAppController {
  constructor(private readonly service: AppService) {}

  @Post('signup')
  async emailValidateForSignUp(
    @Body() request: EmailValidationSignUpRequestDto,
  ): Promise<EmailValidationSignUpResponseDto> {
    const data = await this.service.emailValidateForSignUp(request);

    return {
      data,
      statusCode: 201,
      statusMsg: '',
    };
  }
}
