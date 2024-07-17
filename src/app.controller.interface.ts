import { EmailValidationSignUpRequestDto } from './dto/request/emailValidationSignUp.request.dto';
import { GetWeeklyGraphDataRequestBodyDto, GetWeeklyGraphDataRequestQueryDto } from './dto/request/getWeeklyGraphData.request.dto';
import { ValidateSignUpCodeRequestDto } from './dto/request/validateSignUpCode.request.dto';
import { ControllerResponseDto } from './dto/response/controller.response.dto';
import { EmailValidationSignUpResponseDto } from './dto/response/emailValidationSignUp.response.dto';
import { GetWeeklyGraphDataResponseDto } from './dto/response/getWeeklyGraphData.response.dto';
import { ValidateSignUpCodeResponseDto } from './dto/response/validateSignUpCode.response.dto';

export interface IAppController {
  emailValidateForSignUp(
    request: EmailValidationSignUpRequestDto,
  ): Promise<ControllerResponseDto<EmailValidationSignUpResponseDto>>;
  validateSignUpCode(
    request: ValidateSignUpCodeRequestDto,
  ): Promise<ControllerResponseDto<ValidateSignUpCodeResponseDto>>;
  getWeeklyGraphData(
    requestQuery: GetWeeklyGraphDataRequestQueryDto,
    requestBody: GetWeeklyGraphDataRequestBodyDto,
  ): Promise<ControllerResponseDto<GetWeeklyGraphDataResponseDto>>;
}
