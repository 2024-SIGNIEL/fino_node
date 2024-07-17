import { EmailValidationSignUpRequestDto } from './dto/request/emailValidationSignUp.request.dto';
import {
  GetWeeklyGraphDataRequestBodyDto,
  GetWeeklyGraphDataRequestQueryDto,
} from './dto/request/getWeeklyGraphData.request.dto';
import { ValidateSignUpCodeRequestDto } from './dto/request/validateSignUpCode.request.dto';
import { EmailValidationSignUpResponseDto } from './dto/response/emailValidationSignUp.response.dto';
import { GetWeeklyGraphDataResponseDto } from './dto/response/getWeeklyGraphData.response.dto';
import { ValidateSignUpCodeResponseDto } from './dto/response/validateSignUpCode.response.dto';

export interface IAppService {
  emailValidateForSignUp(
    request: EmailValidationSignUpRequestDto,
  ): Promise<EmailValidationSignUpResponseDto>;
  validateSignUpCode(
    request: ValidateSignUpCodeRequestDto,
  ): Promise<ValidateSignUpCodeResponseDto>;
}
