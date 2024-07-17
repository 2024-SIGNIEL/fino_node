import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { IAppController } from './app.controller.interface';
import { EmailValidationSignUpRequestDto } from './dto/request/emailValidationSignUp.request.dto';
import { EmailValidationSignUpResponseDto } from './dto/response/emailValidationSignUp.response.dto';
import { ControllerResponseDto } from './dto/response/controller.response.dto';
import { ValidateSignUpCodeRequestDto } from './dto/request/validateSignUpCode.request.dto';
import { ValidateSignUpCodeResponseDto } from './dto/response/validateSignUpCode.response.dto';
import { GetWeeklyGraphDataRequestBodyDto, GetWeeklyGraphDataRequestQueryDto } from './dto/request/getWeeklyGraphData.request.dto';
import { GetWeeklyGraphDataResponseDto } from './dto/response/getWeeklyGraphData.response.dto';

@Controller()
export class AppController implements IAppController {
  constructor(
    private readonly service: AppService,
    @Inject(Logger) private logger: Logger,
  ) {}

  @Post('signup')
  async emailValidateForSignUp(
    @Body() request: EmailValidationSignUpRequestDto,
  ): Promise<ControllerResponseDto<EmailValidationSignUpResponseDto>> {
    this.logger.log('Send Email');
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
    this.logger.log('Validate code');
    const data = await this.service.validateSignUpCode(request);

    return {
      data,
      statusCode: 200,
      statusMsg: '',
    };
  }
}
